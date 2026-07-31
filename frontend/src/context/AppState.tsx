import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type ScreenType = 'splash' | 'landing' | 'login' | 'boot' | 'home' | 'upload' | 'nova' | 'journey' | 'profile';

export interface UserProfile {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  preferredRole: string;
  avatarUrl: string;
}

export interface DocumentData {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'docx' | 'image';
  status: 'uploading' | 'processing' | 'done';
  uploadProgress: number;
  processingStep: number;
  skills: string[];
  projects: string[];
  companies: string[];
  internships: string[];
  certificates: string[];
  technologies: string[];
  education: string[];
  achievements: string[];
  confidence: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citations?: string[];
  timestamp: string;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentPage: ScreenType;
  setCurrentPage: (page: ScreenType) => void;
  userProfile: UserProfile;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;
  documents: DocumentData[];
  addDocument: (file: File) => void;
  messages: ChatMessage[];
  addMessage: (text: string, sender: 'user' | 'ai', citations?: string[]) => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  mockExtractionSteps: string[];
  triggerAISynthesis: () => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isLogoutOpen: boolean;
  setIsLogoutOpen: (open: boolean) => void;
  isAvatarLightboxOpen: boolean;
  setIsAvatarLightboxOpen: (open: boolean) => void;
  logout: () => void;
}

const emptyProfile: UserProfile = {
  fullName: '',
  headline: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  dob: '',
  linkedin: '',
  github: '',
  portfolio: '',
  skills: [],
  preferredRole: '',
  avatarUrl: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const mockExtractionSteps = [
  'Reading Document...',
  'Extracting Text...',
  'Finding Skills...',
  'Finding Projects...',
  'Finding Certificates...',
  'Finding Dates...',
  'Connecting Memories...',
  'Done.'
];

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<ScreenType>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile>(emptyProfile);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isAvatarLightboxOpen, setIsAvatarLightboxOpen] = useState(false);

  // Auto-navigate from splash screen
  useEffect(() => {
    if (currentPage === 'splash') {
      const timer = setTimeout(() => {
        setCurrentPage('landing');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Listen to Supabase Auth State
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        localStorage.setItem('token', session.access_token);
        
        if (event === 'SIGNED_IN') {
          try {
            // Sync user to backend Prisma DB
            const userMeta = session.user.user_metadata;
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_URL}/api/auth/sync`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                email: session.user.email,
                fullName: userMeta.full_name || session.user.email?.split('@')[0] || 'User',
                avatarUrl: userMeta.avatar_url || ''
              })
            });
            if (res.ok) {
              const { data } = await res.json();
              if (data && data.profile) {
                setUserProfile(prev => ({
                  ...prev,
                  fullName: data.user.fullName,
                  email: data.user.email,
                  avatarUrl: data.profile.avatarUrl || prev.avatarUrl,
                  headline: data.profile.headline || prev.headline,
                  bio: data.profile.bio || prev.bio,
                  skills: data.profile.skills || prev.skills
                }));
              }
              if (currentPage === 'login' || currentPage === 'landing') {
                setCurrentPage('boot');
                setTimeout(() => setCurrentPage('home'), 1500);
              }
            }
          } catch (err) {
            console.error('Failed to sync auth state', err);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        setUserProfile(emptyProfile);
        setDocuments([]);
        if (currentPage !== 'landing' && currentPage !== 'splash') {
          setCurrentPage('login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentPage]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...newProfile }));
    addToast('Profile updated successfully!', 'success');
  };

  const logout = async () => {
    setIsLogoutOpen(false);
    await supabase.auth.signOut();
    setCurrentPage('login');
    addToast('Successfully logged out.', 'info');
  };

  const addMessage = (text: string, sender: 'user' | 'ai', citations?: string[]) => {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id, sender, text, citations, timestamp }]);
  };

  const addDocument = (file: File) => {
    const id = 'doc-' + Math.random().toString(36).substr(2, 9);
    const type = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'image';
    const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    
    const newDoc: DocumentData = {
      id,
      name: file.name,
      size,
      type,
      status: 'uploading',
      uploadProgress: 0,
      processingStep: 0,
      skills: [],
      projects: [],
      companies: [],
      internships: [],
      certificates: [],
      technologies: [],
      education: [],
      achievements: [],
      confidence: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };

    setDocuments((prev) => [newDoc, ...prev]);
    addToast(`Uploading ${file.name}...`, 'info');

    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += 10;
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => {
          if (doc.id === id) {
            const nextProgress = progress >= 100 ? 100 : progress;
            return {
              ...doc,
              uploadProgress: nextProgress,
              status: nextProgress === 100 ? 'processing' : 'uploading'
            };
          }
          return doc;
        })
      );

      if (progress >= 100) {
        clearInterval(uploadInterval);
        triggerProcessing(id);
      }
    }, 150);
  };

  const triggerProcessing = (id: string) => {
    let step = 0;
    
    const processInterval = setInterval(() => {
      step += 1;
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => {
          if (doc.id === id) {
            if (step >= mockExtractionSteps.length - 1) {
              return {
                ...doc,
                status: 'done',
                processingStep: step,
                confidence: parseFloat((90 + Math.random() * 9).toFixed(1)),
                skills: ['Systems Architecture', 'Asynchronous Workflows', 'Performance Profiling'],
                projects: ['Neural Web Indexer', 'Task Pipeline Router'],
                companies: ['Aura Labs'],
                certificates: ['AWS Cloud Architect'],
                technologies: ['Node.js', 'Go', 'Docker', 'AWS', 'Python'],
                education: ['Certificate in Machine Learning, MIT'],
                achievements: ['Reduced server pipeline latency by 42%', 'Deployed secure sandbox environments']
              };
            }
            return { ...doc, processingStep: step };
          }
          return doc;
        })
      );

      if (step >= mockExtractionSteps.length - 1) {
        clearInterval(processInterval);
        addToast('Document synthesized into digital identity!', 'success');
      }
    }, 800);
  };

  const triggerAISynthesis = () => {
    addToast('Calibrating neural synapses...', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userProfile,
        updateUserProfile,
        documents,
        addDocument,
        messages,
        addMessage,
        toasts,
        addToast,
        removeToast,
        mockExtractionSteps,
        triggerAISynthesis,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isLogoutOpen,
        setIsLogoutOpen,
        isAvatarLightboxOpen,
        setIsAvatarLightboxOpen,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
