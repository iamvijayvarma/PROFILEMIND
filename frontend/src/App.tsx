import React from 'react';
import { AppStateProvider, useAppState } from './context/AppState';
import { Layout } from './components/Layout';
import { SplashScreen } from './pages/SplashScreen';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AIBootScreen } from './pages/AIBootScreen';
import { HomePage } from './pages/HomePage';
import { UploadCenter } from './pages/UploadCenter';
import { NovaAI } from './pages/NovaAI';
import { JourneyTimeline } from './pages/JourneyTimeline';
import { ProfilePage } from './pages/ProfilePage';

const AppContent: React.FC = () => {
  const { currentPage } = useAppState();

  // Helper page dispatcher
  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <SplashScreen />;
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'boot':
        return <AIBootScreen />;
      case 'home':
        return <HomePage />;
      case 'upload':
        return <UploadCenter />;
      case 'nova':
        return <NovaAI />;
      case 'journey':
        return <JourneyTimeline />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
};

function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

export default App;
