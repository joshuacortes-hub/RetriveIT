export type ItemType = 'LOST' | 'FOUND';

export type ItemStatus = 'UNCLAIMED' | 'UNFOUND' | 'FOUND' | 'CLAIMED';

export type ItemCategory = 
  | 'Electronics' 
  | 'Wallets & Bags' 
  | 'Keys' 
  | 'Cards & IDs' 
  | 'Jewelry & Watches' 
  | 'Clothing' 
  | 'Books & Notes' 
  | 'Other';

export interface Item {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  date: string; // e.g. "4/13/2026"
  imageUrl: string;
  location: string;
  category: ItemCategory;
  details: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  reward?: number;
  contactNumber?: string;
  claimantId?: string;
  claimantName?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  role: string;
  points: number;
  phoneNumber?: string;
  joinedDate: string;
  isGuest?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
  isClaimRequest?: boolean;
  claimStatus?: 'pending' | 'accepted' | 'declined';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantEmail: string;
  participantAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  relatedItemId?: string;
  relatedItemTitle?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'claim' | 'match' | 'points' | 'verification';
  targetScreen?: string;
  itemId?: string;
}
