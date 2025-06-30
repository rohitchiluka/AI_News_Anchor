import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Newspaper, 
  Search, 
  Filter,
  Grid,
  MessageSquare,
  Video,
  Settings,
  Zap,
  TrendingUp
} from 'lucide-react';
import { ConversationDisplay } from './ConversationDisplay';
import { QueryInput } from './QueryInput';
import { NewsCategoryDropdown } from './NewsCategoryDropdown';
import { ArticleCard } from './ArticleCard';
import { VideoChatComponent } from './VideoChatComponent';
import { useAuth } from '../../hooks/useAuth';
import { newsService, NewsArticle } from '../../services/newsService';
import { aiService } from '../../services/aiService';
import { speechService } from '../../services/speechService';
import { tavusService, TavusConversationResponse } from '../../services/tavusService';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../store';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  isStreaming?: boolean;
}

type ViewMode = 'chat' | 'news' | 'video';

export function NewsAnchorInterface() {
  const { user, signOut } = useAuth();
  
  // Get state from store
  const {
    messages,
    addMessage,
    isProcessing,
    setIsProcessing,
    isListening,
    setIsListening,
    isSpeaking,
    setIsSpeaking,
    microphoneError,
    setMicrophoneError,
    streamingContent,
    setStreamingContent,
    newsArticles,
    setNewsArticles,
    selectedCategory,
    setSelectedCategory,
    isLoadingNews,
    setIsLoadingNews,
    isVideoActive,
    setIsVideoActive,
    tavusDailyUrl,
    setTavusDailyUrl,
    tavusConversationId,
    setTavusConversationId,
    tavusLoading,
    setTavusLoading,
    tavusError,
    setTavusError,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: "Hello! I'm your AI News Anchor. I can help you stay updated with the latest news, provide historical context, and answer any questions about current events. You can browse news by category, ask me questions, or have a video conversation. What would you like to explore today?",
        timestamp: new Date(),
      };
      addMessage(welcomeMessage);
    }

    // Load initial news
    loadNews(selectedCategory);
  }, []);

  const loadNews = useCallback(async (category: string) => {
    setIsLoadingNews(true);
    try {
      const articles = await newsService.getNewsByCategory(category, 12);
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setIsLoadingNews(false);
    }
  }, [setIsLoadingNews, setNewsArticles]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    loadNews(category);
  }, [loadNews, setSelectedCategory]);

  const saveConversation = useCallback(async (userQuery: string, aiResponse: string, sources: string[] = []) => {
    if (!user) return;

    try {
      await supabase.from('conversations').insert({
        user_id: user.id,
        query: userQuery,
        response: aiResponse,
        news_sources: sources,
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }, [user]);

  // Simulate streaming response
  const simulateStreamingResponse = useCallback((fullResponse: string, onComplete: () => void) => {
    setStreamingContent('');
    const words = fullResponse.split(' ');
    let currentIndex = 0;
    
    const streamInterval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamingContent(prev => {
          const newContent = prev + (prev ? ' ' : '') + words[currentIndex];
          return newContent;
        });
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setStreamingContent('');
        onComplete();
      }
    }, 100); // Add a word every 100ms for natural streaming effect

    return () => clearInterval(streamInterval);
  }, [setStreamingContent]);

  const processQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    setMicrophoneError(''); // Clear any previous errors

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    try {
      // Try to refine the query for better news search
      let refinedQuery = query;
      try {
        refinedQuery = await aiService.refineQuery(query);
      } catch (error) {
        console.warn('Query refinement failed, using original query:', error);
      }
      
      // Search for relevant news
      let newsArticles: NewsArticle[] = [];
      try {
        newsArticles = await newsService.searchNews(refinedQuery, 5);
      } catch (error) {
        console.warn('News search failed:', error);
      }
      
      // Generate AI response with news context
      let aiResponse = '';
      let sources: string[] = [];

      if (newsArticles && newsArticles.length > 0) {
        const newsContext = newsArticles.map(article => 
          `Title: ${article.title}\nDescription: ${article.description}\nSource: ${article.source}`
        ).join('\n\n');

        try {
          aiResponse = await aiService.generateResponse(
            `Based on the following news articles, please provide a comprehensive and informative answer to this question: "${query}"\n\nNews Articles:\n${newsContext}\n\nPlease provide a well-structured response that incorporates the relevant information from these articles.`
          );
        } catch (error) {
          console.warn('AI response generation failed:', error);
          aiResponse = `I found ${newsArticles.length} recent articles related to your query. Here's what I found:\n\n` +
            newsArticles.slice(0, 3).map((article, index) => 
              `${index + 1}. **${article.title}**\n${article.description || 'No description available.'}\nSource: ${article.source}`
            ).join('\n\n');
        }
        
        sources = newsArticles.map(article => article.url).filter(Boolean);
      } else {
        try {
          aiResponse = await aiService.generateResponse(
            `Please provide an informative response to this question: "${query}". If this is about current events or news, please mention that you don't have access to the latest news articles at the moment, but provide any general knowledge you can about the topic.`
          );
        } catch (error) {
          console.warn('AI response generation failed:', error);
          aiResponse = "I apologize, but I couldn't find any recent news articles related to your query, and I'm currently unable to access my AI services. Please try again later or rephrase your question.";
        }
      }

      // Use streaming response
      const cleanup = simulateStreamingResponse(aiResponse, () => {
        // Add final assistant message after streaming is complete
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          sources,
        };
        addMessage(assistantMessage);
        setIsProcessing(false);

        // Save conversation to database
        saveConversation(query, aiResponse, sources);

        // Speak the response if video mode is active and not using Tavus
        if (isVideoActive && !tavusDailyUrl && speechService.isSupported) {
          setIsSpeaking(true);
          speechService.speak(aiResponse).then(() => {
            setIsSpeaking(false);
          }).catch((error) => {
            console.warn('Speech synthesis failed:', error);
            setIsSpeaking(false);
          });
        }
      });

      // Store cleanup function in case we need to cancel
      return cleanup;

    } catch (error) {
      console.error('Error processing query:', error);
      setStreamingContent('');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "I apologize, but I encountered an issue while processing your request. This might be due to a temporary service outage. Please try again later or contact support if the problem persists.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
      setIsProcessing(false);
    }
  }, [
    setIsProcessing,
    setMicrophoneError,
    addMessage,
    saveConversation,
    isVideoActive,
    tavusDailyUrl,
    simulateStreamingResponse,
    setIsSpeaking,
    setStreamingContent
  ]);

  const handleArticleSelect = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
    setViewMode('chat');
    
    // Auto-generate a question about the article
    const question = `Tell me more about this news: "${article.title}"`;
    processQuery(question);
  }, [processQuery]);

  const handleToggleVideo = useCallback(async () => {
    if (!isVideoActive) {
      // Activating video - create Tavus conversation
      setTavusLoading(true);
      setTavusError('');
      
      try {
        const personaId = import.meta.env.VITE_TAVUS_PERSONA_ID;
        
        if (!personaId || personaId === 'your_tavus_persona_id') {
          throw new Error('Tavus Persona ID not configured. Please add VITE_TAVUS_PERSONA_ID to your .env file.');
        }

        const conversation: TavusConversationResponse = await tavusService.createConversation(personaId);
        
        setTavusDailyUrl(conversation.daily_url);
        setTavusConversationId(conversation.conversation_id);
        setIsVideoActive(true);
        
        console.log('Tavus conversation created:', conversation);
      } catch (error) {
        console.error('Error creating Tavus conversation:', error);
        setTavusError(error instanceof Error ? error.message : 'Failed to start video conversation');
      } finally {
        setTavusLoading(false);
      }
    } else {
      // Deactivating video - end Tavus conversation
      if (tavusConversationId) {
        try {
          await tavusService.endConversation(tavusConversationId);
        } catch (error) {
          console.warn('Error ending Tavus conversation:', error);
        }
      }
      
      setIsVideoActive(false);
      setTavusDailyUrl('');
      setTavusConversationId('');
      setTavusError('');
    }
  }, [
    isVideoActive,
    tavusConversationId,
    setTavusLoading,
    setTavusError,
    setTavusDailyUrl,
    setTavusConversationId,
    setIsVideoActive
  ]);

  const getErrorMessage = (error: Error): string => {
    switch (error.message) {
      case 'microphone-permission-denied':
        return 'Microphone access was denied. Please click the microphone icon in your browser\'s address bar and allow microphone access, then try again.';
      case 'microphone-access-failed':
        return 'Unable to access your microphone. Please check that your microphone is connected and working properly.';
      case 'no-speech-detected':
        return 'No speech was detected. Please try speaking more clearly or check your microphone volume.';
      case 'network-error':
        return 'Network error occurred during speech recognition. This could be due to:\n\n• Internet connectivity issues - check your connection\n• AssemblyAI API key issues - verify your VITE_SPEECH_API_KEY in .env file\n• Browser speech recognition service unavailable\n\nTry refreshing the page or check your network connection.';
      case 'failed-to-start-recognition':
        return 'Failed to start speech recognition. This could be due to:\n\n• Browser compatibility issues - try using Chrome, Edge, or Safari\n• Microphone already in use by another application\n• Browser security restrictions\n• Missing or invalid AssemblyAI API key\n\nPlease check your browser settings and try again.';
      case 'microphone-recording-failed':
        return 'Microphone recording failed. Please ensure:\n\n• Your microphone is properly connected\n• No other applications are using the microphone\n• Browser has permission to access the microphone\n• Try refreshing the page and allowing microphone access again';
      case 'Speech recognition not supported and real-time transcription failed':
        return 'Speech recognition is not available. This could be due to:\n\n• Browser doesn\'t support speech recognition (try Chrome, Edge, or Safari)\n• AssemblyAI API key is missing or invalid\n• Network connectivity issues\n\nPlease check your VITE_SPEECH_API_KEY in the .env file and ensure you have a stable internet connection.';
      default:
        if (error.message.includes('Speech recognition not supported')) {
          return 'Speech recognition is not supported in your browser. Please try using a modern browser like Chrome, Edge, or Safari for the best experience.';
        }
        if (error.message.includes('AssemblyAI')) {
          return 'Real-time speech recognition service is unavailable. Please check your VITE_SPEECH_API_KEY in the .env file and ensure you have a valid AssemblyAI API key.';
        }
        return `Voice input error: ${error.message}\n\nPlease try again or use text input instead. If the problem persists, check your microphone settings and internet connection.`;
    }
  };

  const handleVoiceInput = useCallback(async () => {
    if (!speechService.isSupported) {
      setMicrophoneError('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }

    try {
      setIsListening(true);
      setMicrophoneError('');
      const transcript = await speechService.startListening();
      setIsListening(false);
      
      if (transcript) {
        await processQuery(transcript);
      }
    } catch (error) {
      setIsListening(false);
      console.error('Voice input error:', error);
      
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'An unexpected error occurred with voice input.';
      setMicrophoneError(errorMessage);
    }
  }, [processQuery, setIsListening, setMicrophoneError]);

  const handleStopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
  }, [setIsListening]);

  const handleStopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, [setIsSpeaking]);

  const handleSignOut = useCallback(async () => {
    // End Tavus conversation if active
    if (tavusConversationId) {
      try {
        await tavusService.endConversation(tavusConversationId);
      } catch (error) {
        console.warn('Error ending Tavus conversation on sign out:', error);
      }
    }
    
    await signOut();
  }, [signOut, tavusConversationId]);

  const filteredArticles = newsArticles.filter(article =>
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-sci-black">
      {/* Header */}
      <header className="glass-effect border-b border-sci-gray-100 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-cyan-to-blue rounded-full flex items-center justify-center shadow-glow-cyan">
                <Zap className="w-6 h-6 text-sci-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-poppins gradient-text">Intellect</h1>
                <p className="text-xs text-sci-light-gray">AI News Anchor</p>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="hidden md:flex items-center space-x-2 ml-8">
              {[
                { mode: 'chat' as ViewMode, icon: MessageSquare, label: 'Chat' },
                { mode: 'news' as ViewMode, icon: Newspaper, label: 'News' },
                { mode: 'video' as ViewMode, icon: Video, label: 'Video' },
              ].map(({ mode, icon: Icon, label }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-sci-cyan text-sci-black font-semibold'
                      : 'text-sci-light-gray hover:text-sci-white hover:bg-sci-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-sci-light-gray hidden sm:inline">
              Welcome, {user?.email?.split('@')[0]}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile View Mode Tabs */}
        <div className="md:hidden flex items-center justify-center space-x-2 mt-4">
          {[
            { mode: 'chat' as ViewMode, icon: MessageSquare, label: 'Chat' },
            { mode: 'news' as ViewMode, icon: Newspaper, label: 'News' },
            { mode: 'video' as ViewMode, icon: Video, label: 'Video' },
          ].map(({ mode, icon: Icon, label }) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode(mode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-sci-cyan text-sci-black font-semibold'
                  : 'text-sci-light-gray hover:text-sci-white hover:bg-sci-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{label}</span>
            </motion.button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        <AnimatePresence mode="wait">
          {viewMode === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Conversation Area - Now properly constrained */}
              <div className="flex-1 min-h-0">
                <ConversationDisplay messages={messages} />
              </div>

              {/* Text Input - Fixed at bottom */}
              <div className="flex-shrink-0">
                <QueryInput
                  onSubmit={processQuery}
                  onVoiceInput={handleVoiceInput}
                  placeholder={isListening ? "Listening..." : "Ask me about any news topic..."}
                />
              </div>
            </motion.div>
          )}

          {viewMode === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col"
            >
              {/* News Controls */}
              <div className="p-4 border-b border-sci-gray-100 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <NewsCategoryDropdown
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    isLoading={isLoadingNews}
                  />
                  
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-sci-light-gray" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 glass-card text-sci-white placeholder-sci-light-gray/60 focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-sci-light-gray">
                      <TrendingUp className="w-4 h-4" />
                      <span>{filteredArticles.length} articles</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* News Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoadingNews ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="glass-card p-6 animate-pulse">
                        <div className="h-48 bg-sci-gray-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-sci-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-sci-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-3 bg-sci-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                      <ArticleCard
                        key={`${article.url}-${index}`}
                        article={article}
                        onSelect={() => handleArticleSelect(article)}
                        isSelected={selectedArticle?.url === article.url}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Newspaper className="w-16 h-16 text-sci-light-gray mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-sci-white mb-2">No articles found</h3>
                      <p className="text-sci-light-gray">
                        Try selecting a different category or adjusting your search terms.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {viewMode === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col lg:flex-row gap-6 p-6"
            >
              {/* Video Component */}
              <div className="lg:w-2/3">
                <VideoChatComponent
                  isActive={isVideoActive}
                  onToggleVideo={handleToggleVideo}
                  tavusDailyUrl={tavusDailyUrl}
                  isLoading={tavusLoading}
                  error={tavusError}
                />
              </div>

              {/* Chat Sidebar - Always visible with proper spacing */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="glass-card flex-1 flex flex-col min-h-0">
                  <div className="p-4 border-b border-sci-gray-100 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-sci-white mb-2">
                      {tavusDailyUrl ? 'Video Chat Active' : 'Video Chat'}
                    </h3>
                    <p className="text-sm text-sci-light-gray">
                      {tavusDailyUrl 
                        ? 'Interact directly in the video or use this chat'
                        : 'Activate video to start conversing with your AI news anchor'
                      }
                    </p>
                  </div>
                  
                  {/* Messages Area with proper scrolling */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-3 rounded-lg break-words ${
                          message.type === 'user'
                            ? 'bg-sci-cyan text-sci-black'
                            : 'bg-sci-gray-200 text-sci-white'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="text-xs opacity-70 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Streaming content in video chat */}
                    {streamingContent && (
                      <div className="flex justify-start">
                        <div className="bg-sci-gray-200 text-sci-white p-3 rounded-lg max-w-[85%]">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {streamingContent}
                            <span className="inline-block w-2 h-4 bg-sci-cyan ml-1 animate-pulse" />
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Typing indicator */}
                    {isProcessing && !streamingContent && (
                      <div className="flex justify-start">
                        <div className="bg-sci-gray-200 text-sci-white p-3 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Input Area with proper spacing */}
                  <div className="p-4 border-t border-sci-gray-100 flex-shrink-0">
                    <div className="space-y-3">
                      {/* Voice Controls */}
                      {!tavusDailyUrl && (
                        <div className="flex justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleVoiceInput}
                            disabled={isProcessing || isListening}
                            className={`p-3 rounded-full transition-all duration-200 ${
                              isListening 
                                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                                : 'bg-sci-cyan hover:bg-sci-cyan/80'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        </div>
                      )}
                      
                      {/* Text Input */}
                      <div className="relative">
                        <textarea
                          placeholder={tavusDailyUrl ? "Type your message..." : "Ask about news..."}
                          className="w-full p-3 glass-card text-sci-white placeholder-sci-light-gray/60 focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:border-transparent resize-none text-sm rounded-lg"
                          rows={2}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const target = e.target as HTMLTextAreaElement;
                              if (target.value.trim()) {
                                processQuery(target.value.trim());
                                target.value = '';
                              }
                            }
                          }}
                          disabled={isProcessing}
                        />
                        <div className="absolute bottom-2 right-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                              if (textarea?.value.trim()) {
                                processQuery(textarea.value.trim());
                                textarea.value = '';
                              }
                            }}
                            disabled={isProcessing}
                            className="p-2 bg-sci-cyan hover:bg-sci-cyan/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Error Display */}
                      {microphoneError && (
                        <div className="text-xs text-red-400 bg-red-500/20 p-2 rounded whitespace-pre-line">
                          {microphoneError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}