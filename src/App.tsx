import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FloatingPrototypeMenu } from './components/WireframeNavigator';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { HomeScreen } from './components/HomeScreen';
import { CreatePostScreen } from './components/CreatePostScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { ChatDetailScreen } from './components/ChatDetailScreen';
import { NotificationScreen } from './components/NotificationScreen';
import { SideDrawer } from './components/SideDrawer';
import { ItemDetailModal } from './components/ItemDetailModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { RetrieversPointsModal } from './components/RetrieversPointsModal';
import { IdentityVerificationModal } from './components/IdentityVerificationModal';
import { AccountSecurityModal } from './components/AccountSecurityModal';
import { HelpSupportModal } from './components/HelpSupportModal';
import { AboutUsModal } from './components/AboutUsModal';
import { EditEmailModal } from './components/EditEmailModal';
import { GuestRestrictionModal } from './components/GuestRestrictionModal';

const ScreenRouter: React.FC = () => {
  const { activeScreen } = useApp();

  switch (activeScreen) {
    case 'login':
      return <LoginScreen />;
    case 'signup':
      return <SignUpScreen />;
    case 'home':
      return <HomeScreen />;
    case 'create_post':
      return <CreatePostScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'messages':
      return <MessagesScreen />;
    case 'chat_detail':
      return <ChatDetailScreen />;
    case 'notifications':
      return <NotificationScreen />;
    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      {/* 
        Native Mobile Web Application:
        Direct, edge-to-edge UI without any simulated phone frames, fake phone bezels, 
        mock hardware notches, or artificial device wrappers.
      */}
      <div className="min-h-screen min-h-[100dvh] w-full bg-[#fcfbf7] flex flex-col justify-start items-center overflow-x-hidden">
        {/* Main mobile viewport container: 100% on mobile, max-w-md on desktop */}
        <main className="w-full max-w-md min-h-screen min-h-[100dvh] flex flex-col bg-[#fcfbf7] relative shadow-xs overflow-x-hidden">
          <ScreenRouter />
        </main>

        {/* Global Drawers & Modals */}
        <SideDrawer />
        <GuestRestrictionModal />
        <ItemDetailModal />
        <GoogleAuthModal />
        <RetrieversPointsModal />
        <IdentityVerificationModal />
        <AccountSecurityModal />
        <HelpSupportModal />
        <AboutUsModal />
        <EditEmailModal />

        {/* Discreet floating screen switcher */}
        <FloatingPrototypeMenu />
      </div>
    </AppProvider>
  );
}
