import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Conversation state
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  
  // Core interaction states
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  
  microphoneError: string;
  setMicrophoneError: (error: string) => void;
  
  streamingContent: string;
  setStreamingContent: (content: string) => void;
  
  // News state
  newsArticles: any[];
  setNewsArticles: (articles: any[]) => void;
  
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  
  isLoadingNews: boolean;
  setIsLoadingNews: (loading: boolean) => void;
  
  // Video state
  isVideoActive: boolean;
  setIsVideoActive: (active: boolean) => void;
  
  tavusDailyUrl: string;
  setTavusDailyUrl: (url: string) => void;
  
  tavusConversationId: string;
  setTavusConversationId: (id: string) => void;
  
  tavusLoading: boolean;
  setTavusLoading: (loading: boolean) => void;
  
  tavusError: string;
  setTavusError: (error: string) => void;
  
  // Preferences
  preferences: {
    voiceEnabled: boolean;
    autoSpeak: boolean;
    newsCategories: string[];
    theme: 'dark' | 'light';
  };
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
  
  // Cache management
  clearCache: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Conversation state
      messages: [],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      clearMessages: () => set({ messages: [] }),
      
      // Core interaction states
      isProcessing: false,
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      
      isListening: false,
      setIsListening: (listening) => set({ isListening: listening }),
      
      isSpeaking: false,
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
      
      microphoneError: '',
      setMicrophoneError: (error) => set({ microphoneError: error }),
      
      streamingContent: '',
      setStreamingContent: (content) => set({ streamingContent: content }),
      
      // News state
      newsArticles: [],
      setNewsArticles: (articles) => set({ newsArticles: articles }),
      
      selectedCategory: 'all',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      
      isLoadingNews: false,
      setIsLoadingNews: (loading) => set({ isLoadingNews: loading }),
      
      // Video state
      isVideoActive: false,
      setIsVideoActive: (active) => set({ isVideoActive: active }),
      
      tavusDailyUrl: '',
      setTavusDailyUrl: (url) => set({ tavusDailyUrl: url }),
      
      tavusConversationId: '',
      setTavusConversationId: (id) => set({ tavusConversationId: id }),
      
      tavusLoading: false,
      setTavusLoading: (loading) => set({ tavusLoading: loading }),
      
      tavusError: '',
      setTavusError: (error) => set({ tavusError: error }),
      
      // Preferences
      preferences: {
        voiceEnabled: true,
        autoSpeak: true,
        newsCategories: ['Technology', 'Science', 'Business'],
        theme: 'dark',
      },
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences }
      })),
      
      // Cache management
      clearCache: () => {
        // This will be used by services to clear their caches
        console.log('Cache cleared from store');
      },
    }),
    {
      name: 'intellect-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        messages: state.messages.slice(-50), // Keep only last 50 messages
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);