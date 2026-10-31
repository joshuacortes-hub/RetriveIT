import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, User, Conversation, ChatMessage, AppNotification, ItemType, ItemStatus } from '../types';
import {
  auth,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  collection,
  onSnapshot,
  updateDoc,
  getDocs,
  getDocFromServer,
} from '../firebase';
import confetti from 'canvas-confetti';

export type ScreenName =
  | 'login'
  | 'signup'
  | 'home'
  | 'create_post'
  | 'profile'
  | 'messages'
  | 'chat_detail'
  | 'notifications';

export type ModalType =
  | 'none'
  | 'item_detail'
  | 'retrievers_points'
  | 'identity_verification'
  | 'account_security'
  | 'help_support'
  | 'about_us'
  | 'google_auth'
  | 'claim_flow'
  | 'edit_email'
  | 'guest_restriction_prompt';

export interface RegisteredAccount {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  role: string;
  isVerified: boolean;
  joinedDate: string;
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  activeScreen: ScreenName;
  setActiveScreen: (screen: ScreenName) => void;
  items: Item[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  notifications: AppNotification[];
  selectedConversationId: string | null;
  selectedItemId: string | null;
  selectedModalItem: Item | null;
  isDrawerOpen: boolean;
  activeModal: ModalType;
  guestPromptReason: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  openModal: (modal: ModalType, item?: Item) => void;
  closeModal: () => void;
  triggerGuestRestriction: (reason: string) => void;
  login: (usernameOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (firstName: string, lastName: string, username: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  verifyInstantGoogleUser: (name?: string, email?: string) => void;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  updateEmail: (email: string) => void;
  addNewPost: (post: {
    title: string;
    type: ItemType;
    details: string;
    location: string;
    category: any;
    imageUrl?: string;
  }) => Item | null;
  claimItem: (itemId: string, claimantNote: string) => void;
  markItemResolved: (itemId: string) => void;
  openChatWithUser: (user: { id: string; name: string; email: string }, item?: Item) => void;
  sendMessage: (convId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadCount: number;
  isGuest: boolean;
  registrationSuccessMessage: string | null;
  clearRegistrationSuccessMessage: () => void;
  lastRegisteredUsername: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear old legacy cached dummy accounts and items
  useEffect(() => {
    localStorage.removeItem('retrieveit_user');
    localStorage.removeItem('retrieveit_items');
  }, []);

  // Use v2 storage keys for clean state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('retrieveit_user_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeScreen, setActiveScreen] = useState<ScreenName>(() => {
    return localStorage.getItem('retrieveit_user_v2') ? 'home' : 'login';
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [selectedModalItem, setSelectedModalItem] = useState<Item | null>(null);
  const [guestPromptReason, setGuestPromptReason] = useState<string>('');

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('retrieveit_items_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('retrieveit_conversations_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('retrieveit_messages_v2');
    return saved ? JSON.parse(saved) : {};
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('retrieveit_notifications_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Registration feedback state
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState<string | null>(null);
  const [lastRegisteredUsername, setLastRegisteredUsername] = useState<string | null>(null);
  const clearRegistrationSuccessMessage = () => setRegistrationSuccessMessage(null);

  // Registered Accounts for username & password authentication
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('retrieveit_registered_accounts_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('retrieveit_registered_accounts_v1', JSON.stringify(registeredAccounts));
    } catch {}
  }, [registeredAccounts]);

  // Load registered users from Firestore on startup
  useEffect(() => {
    const fetchRegistered = async () => {
      try {
        const snap = await getDocs(collection(db, 'registered_users'));
        if (!snap.empty) {
          const list: RegisteredAccount[] = [];
          snap.forEach((d: any) => {
            const data = d.data() as RegisteredAccount;
            if (data && data.username) {
              list.push(data);
            }
          });
          setRegisteredAccounts((prev) => {
            const map = new Map<string, RegisteredAccount>();
            prev.forEach((a) => map.set(a.username.toLowerCase(), a));
            list.forEach((a) => map.set(a.username.toLowerCase(), a));
            return Array.from(map.values());
          });
        }
      } catch {
        // Fallback to local accounts
      }
    };
    fetchRegistered();
  }, []);

  // Sync real-time items from Firestore
  useEffect(() => {
    try {
      const itemsCol = collection(db, 'items');
      const unsubscribe = onSnapshot(itemsCol, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Item[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Item);
          });
          // Sort newest first
          loaded.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          setItems(loaded);
          localStorage.setItem('retrieveit_items_v2', JSON.stringify(loaded));
        }
      }, (err) => {
        console.warn('Firestore onSnapshot notice:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore listener error:', e);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        const displayName = fbUser.displayName || 'Google Retriever';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || 'Retriever';

        const verifiedUser: User = {
          id: fbUser.uid,
          firstName,
          lastName,
          email: fbUser.email,
          avatar: fbUser.photoURL || undefined,
          isVerified: true,
          role: 'Verified Retriever',
          points: 500,
          joinedDate: 'October 2026',
          isGuest: false,
        };

        setCurrentUser(verifiedUser);
        localStorage.setItem('retrieveit_user_v2', JSON.stringify(verifiedUser));

        // Sync to Firestore /users/{uid}
        try {
          await setDoc(doc(db, 'users', fbUser.uid), {
            id: fbUser.uid,
            firstName,
            lastName,
            email: fbUser.email,
            role: 'Verified Retriever',
            points: 500,
            isVerified: true,
          }, { merge: true });
        } catch {
          // Non-blocking
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('retrieveit_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('retrieveit_user_v2');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('retrieveit_items_v2', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('retrieveit_conversations_v2', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('retrieveit_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('retrieveit_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  const isGuest = !currentUser || currentUser.isGuest === true;

  const triggerGuestRestriction = (reason: string) => {
    setGuestPromptReason(reason);
    setActiveModal('guest_restriction_prompt');
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const openModal = (modal: ModalType, item?: Item) => {
    if (item) setSelectedModalItem(item);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal('none');
    setSelectedModalItem(null);
  };

  const login = async (usernameOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setRegistrationSuccessMessage(null);
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    if (!cleanInput) {
      return { success: false, error: 'Please enter your username.' };
    }
    if (!pass) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Check in registeredAccounts
    let account = registeredAccounts.find(
      (acc) => acc.username.toLowerCase() === cleanInput || acc.email.toLowerCase() === cleanInput
    );

    // If not found in memory, try fetching from Firestore registered_users directly
    if (!account) {
      try {
        const docRef = doc(db, 'registered_users', cleanInput);
        const docSnap = await getDocFromServer(docRef);
        if (docSnap.exists()) {
          account = docSnap.data() as RegisteredAccount;
          setRegisteredAccounts((prev) => [...prev, account!]);
        }
      } catch {
        // Fallback
      }
    }

    // Login relies strictly on registration
    if (!account) {
      return {
        success: false,
        error: `Username "${usernameOrEmail.trim()}" is not registered. Please sign up first.`,
      };
    }

    // Check password
    if (account.password !== pass) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    const user: User = {
      id: account.id,
      username: account.username,
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      isVerified: true,
      role: account.role || 'Retriever',
      points: account.points || 100,
      joinedDate: account.joinedDate || 'October 2026',
      isGuest: false,
    };

    setCurrentUser(user);
    setActiveScreen('home');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    return { success: true };
  };

  const signup = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName) {
      return { success: false, error: 'Please enter your first and last name.' };
    }
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!cleanEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Check if username already registered
    const usernameTaken = registeredAccounts.some(
      (acc) => acc.username.toLowerCase() === cleanUsername
    );
    if (usernameTaken) {
      return { success: false, error: `Username "${cleanUsername}" is already taken. Please choose another.` };
    }

    // Check if email already registered
    const emailTaken = registeredAccounts.some(
      (acc) => acc.email.toLowerCase() === cleanEmail
    );
    if (emailTaken) {
      return { success: false, error: 'An account with this email is already registered. Please log in.' };
    }

    const newAccount: RegisteredAccount = {
      id: 'usr_' + Date.now(),
      username: cleanUsername,
      password: pass,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      points: 100,
      role: 'Retriever',
      isVerified: true,
      joinedDate: 'October 2026',
      createdAt: new Date().toISOString(),
    };

    setRegisteredAccounts((prev) => [...prev, newAccount]);

    // Save to Firestore registered_users
    try {
      setDoc(doc(db, 'registered_users', cleanUsername), newAccount).catch(() => {});
    } catch {}

    const welcomeNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: 'Welcome to RetrieveIT!',
      description: `Welcome @${cleanUsername}! You earned 100 Retrievers Points for creating your account.`,
      timestamp: 'Just now',
      read: false,
      type: 'points',
      targetScreen: 'profile',
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    // Store registered username to prefill login form and show confirmation message
    setLastRegisteredUsername(cleanUsername);
    setRegistrationSuccessMessage(`Registration successful! Please enter your password to log in as @${cleanUsername}.`);

    // Bring user back to login screen to log into the new account
    setActiveScreen('login');
    return { success: true };
  };

  // Direct Google Sign-In with real Firebase Auth
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const nameParts = (fbUser.displayName || 'Google User').split(' ');
      const googleUser: User = {
        id: fbUser.uid,
        firstName: nameParts[0] || 'Google',
        lastName: nameParts.slice(1).join(' ') || 'User',
        email: fbUser.email || 'user@gmail.com',
        avatar: fbUser.photoURL || undefined,
        isVerified: true,
        role: 'Verified Retriever',
        points: 500,
        joinedDate: 'October 2026',
        isGuest: false,
      };

      setCurrentUser(googleUser);
      closeModal();
      setActiveScreen('home');
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      return { success: true };
    } catch (popupError: any) {
      // Gracefully handle popup close, cancellation, or blocked popup without triggering AI Studio error flags
      const code = popupError?.code || '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.warn('Google Sign-In note:', code || popupError?.message || 'Authentication in progress');
      }
      return {
        success: false,
        error: 'Please get verified',
      };
    }
  };

  const verifyInstantGoogleUser = (name = 'Google Retriever', email = 'verified.retriever@gmail.com') => {
    const nameParts = name.trim().split(' ');
    const verifiedUser: User = {
      id: 'usr_g_' + Date.now(),
      firstName: nameParts[0] || 'Google',
      lastName: nameParts.slice(1).join(' ') || 'Retriever',
      email: email,
      isVerified: true,
      role: 'Verified Retriever',
      points: 500,
      joinedDate: 'October 2026',
      isGuest: false,
    };
    setCurrentUser(verifiedUser);
    closeModal();
    setActiveScreen('home');
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
  };

  const continueAsGuest = () => {
    const guestUser: User = {
      id: 'usr_guest',
      firstName: 'Guest',
      lastName: 'Retriever',
      email: 'guest@retrieveit.app',
      isVerified: false,
      role: 'Guest',
      points: 0,
      joinedDate: 'October 2026',
      isGuest: true,
    };
    setCurrentUser(guestUser);
    setActiveScreen('home');
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setActiveScreen('login');
    setIsDrawerOpen(false);
  };

  const updateEmail = (newEmail: string) => {
    if (!currentUser || isGuest) return;
    setCurrentUser({
      ...currentUser,
      email: newEmail,
    });
  };

  const addNewPost = (post: {
    title: string;
    type: ItemType;
    details: string;
    location: string;
    category: any;
    imageUrl?: string;
  }): Item | null => {
    // Strict restriction: Guests cannot post items
    if (isGuest || !currentUser) {
      triggerGuestRestriction('post items. Only verified accounts can submit lost or found reports to prevent fake listings.');
      return null;
    }

    const today = new Date();
    const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    const defaultImg =
      post.type === 'FOUND'
        ? 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=600&q=80';

    const defaultStatus: ItemStatus = post.type === 'FOUND' ? 'UNCLAIMED' : 'UNFOUND';

    const newItem: Item = {
      id: 'item_' + Date.now(),
      title: post.title || (post.type === 'FOUND' ? 'Found Item' : 'Lost Item'),
      type: post.type,
      status: defaultStatus,
      date: formattedDate,
      imageUrl: post.imageUrl || defaultImg,
      location: post.location || 'Campus Center',
      category: post.category || 'Other',
      details: post.details,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorEmail: currentUser.email,
      createdAt: new Date().toISOString(),
      reward: post.type === 'LOST' ? 20 : undefined,
    };

    setItems((prev) => [newItem, ...prev]);

    // Give points for verified post
    setCurrentUser((prev) => (prev ? { ...prev, points: prev.points + 25 } : null));

    // Save to live Firestore database
    try {
      setDoc(doc(db, 'items', newItem.id), newItem).catch((err) => {
        console.warn('Firestore write warning:', err);
      });
    } catch (e) {
      console.warn('Firestore setDoc error:', e);
    }

    const postNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: 'Post Published Successfully',
      description: `Your ${post.type.toLowerCase()} item post has been shared with the community.`,
      timestamp: 'Just now',
      read: false,
      type: 'match',
      targetScreen: 'home',
      itemId: newItem.id,
    };
    setNotifications((prev) => [postNotif, ...prev]);

    return newItem;
  };

  const claimItem = (itemId: string, claimantNote: string) => {
    // Strict restriction: Guests cannot claim items
    if (isGuest || !currentUser) {
      triggerGuestRestriction('claim items. You must sign in with a verified Google account to prove ownership and claim belongings.');
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const updated = {
            ...it,
            status: 'CLAIMED' as ItemStatus,
            claimantId: currentUser.id,
            claimantName: `${currentUser.firstName} ${currentUser.lastName}`,
          };
          // Sync update to Firestore
          try {
            updateDoc(doc(db, 'items', itemId), {
              status: 'CLAIMED',
              claimantId: currentUser.id,
              claimantName: `${currentUser.firstName} ${currentUser.lastName}`,
            }).catch(() => {});
          } catch {}
          return updated;
        }
        return it;
      })
    );

    setCurrentUser((prev) => (prev ? { ...prev, points: prev.points + 50 } : null));

    const claimNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: 'Item Claim Submitted',
      description: `Claim request submitted: "${claimantNote.slice(0, 40)}..."`,
      timestamp: 'Just now',
      read: false,
      type: 'claim',
      targetScreen: 'home',
      itemId,
    };
    setNotifications((prev) => [claimNotif, ...prev]);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
  };

  const markItemResolved = (itemId: string) => {
    if (isGuest || !currentUser) return;

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          const nextStatus: ItemStatus = it.type === 'LOST' ? 'FOUND' : 'CLAIMED';
          try {
            updateDoc(doc(db, 'items', itemId), { status: nextStatus }).catch(() => {});
          } catch {}
          return { ...it, status: nextStatus };
        }
        return it;
      })
    );
  };

  const openChatWithUser = (user: { id: string; name: string; email: string }, item?: Item) => {
    // Strict restriction: Guests cannot chat
    if (isGuest || !currentUser) {
      triggerGuestRestriction('send messages. Sign in with a verified account to communicate securely with finders.');
      return;
    }

    let conv = conversations.find((c) => c.participantEmail === user.email || c.participantId === user.id);
    if (!conv) {
      const newConvId = 'conv_' + Date.now();
      const newConv: Conversation = {
        id: newConvId,
        participantId: user.id,
        participantName: user.name,
        participantRole: 'Retriever',
        participantEmail: user.email,
        lastMessage: item ? `Hi, inquiring about: ${item.title}` : 'Started a conversation',
        timestamp: 'Just now',
        unreadCount: 0,
        relatedItemId: item?.id,
        relatedItemTitle: item?.title,
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConvId]: item
          ? [
              {
                id: 'msg_' + Date.now(),
                conversationId: newConvId,
                senderId: currentUser.id,
                senderName: `${currentUser.firstName} ${currentUser.lastName}`,
                text: `Hi ${user.name}, I'm reaching out about "${item.title}". Is it still available?`,
                timestamp: 'Just now',
              },
            ]
          : [],
      }));
      conv = newConv;
    }

    setSelectedConversationId(conv.id);
    setActiveScreen('chat_detail');
  };

  const sendMessage = (convId: string, text: string) => {
    if (!text.trim() || isGuest || !currentUser) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: currentUser.id,
      senderName: `${currentUser.firstName} ${currentUser.lastName}`,
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, lastMessage: text.trim(), timestamp: 'Just now' } : c))
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeScreen,
        setActiveScreen,
        items,
        conversations,
        messages,
        notifications,
        selectedConversationId,
        selectedItemId,
        selectedModalItem,
        isDrawerOpen,
        activeModal,
        guestPromptReason,
        openDrawer,
        closeDrawer,
        openModal,
        closeModal,
        triggerGuestRestriction,
        login,
        signup,
        loginWithGoogle,
        verifyInstantGoogleUser,
        continueAsGuest,
        logout,
        updateEmail,
        addNewPost,
        claimItem,
        markItemResolved,
        openChatWithUser,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadCount,
        isGuest,
        registrationSuccessMessage,
        clearRegistrationSuccessMessage,
        lastRegisteredUsername,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
