import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useAppStore } from '../../store';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
  isStreaming?: boolean;
}

interface ConversationDisplayProps {
  messages: Message[];
}

const ConversationDisplay = React.memo(function ConversationDisplay({ messages }: ConversationDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get state from store
  const isProcessing = useAppStore((state) => state.isProcessing);
  const streamingContent = useAppStore((state) => state.streamingContent);

  // Smart auto-scroll: only scroll to bottom for new messages or streaming
  useEffect(() => {
    if (messagesEndRef.current && containerRef.current) {
      const container = containerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Auto-scroll if user is near the bottom or if it's a new message
      if (isNearBottom || streamingContent || isProcessing) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages, streamingContent, isProcessing]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6"
      style={{ 
        scrollBehavior: 'smooth',
        maxHeight: '100%',
        overflowY: 'scroll'
      }}
    >
      <AnimatePresence>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3 md:ml-4' : 'mr-3 md:mr-4'}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-sci-blue to-sci-cyan' 
                    : 'bg-gradient-to-r from-sci-purple to-sci-cyan'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 md:w-6 md:h-6 text-sci-white" />
                  ) : (
                    <Bot className="w-5 h-5 md:w-6 md:h-6 text-sci-white" />
                  )}
                </div>
              </div>
              
              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 md:p-6 rounded-2xl max-w-full ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-sci-blue to-sci-cyan text-sci-white shadow-glow-blue'
                    : 'glass-card text-sci-white border border-sci-cyan/30 shadow-glow-cyan'
                }`}>
                  {/* Message Header */}
                  <div className={`flex items-center mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-center space-x-2">
                      {message.type === 'assistant' && (
                        <Sparkles className="w-4 h-4 text-sci-cyan" />
                      )}
                      <span className="text-xs font-medium opacity-80">
                        {message.type === 'user' ? 'You' : 'AI News Anchor'}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  
                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-sci-white/20">
                      <p className="text-xs font-medium text-sci-cyan mb-3 flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        News Sources ({message.sources.length})
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {message.sources.slice(0, 3).map((source, index) => (
                          <motion.a
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            href={source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 bg-sci-white/10 rounded-lg hover:bg-sci-white/20 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-sci-light-gray group-hover:text-sci-white transition-colors truncate">
                                {new URL(source).hostname}
                              </span>
                              <ExternalLink className="w-3 h-3 text-sci-cyan opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </motion.a>
                        ))}
                        {message.sources.length > 3 && (
                          <div className="text-xs text-sci-light-gray text-center py-2">
                            +{message.sources.length - 3} more sources
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Timestamp */}
                <div className={`flex items-center mt-2 text-xs text-sci-light-gray ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {format(message.timestamp, 'HH:mm')}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Streaming Response */}
        {(isProcessing || streamingContent) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-4xl">
              <div className="flex-shrink-0 mr-3 md:mr-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-sci-purple to-sci-cyan shadow-lg">
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-sci-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="inline-block p-4 md:p-6 rounded-2xl glass-card border border-sci-cyan/30 max-w-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-sci-cyan animate-pulse" />
                    <span className="text-xs font-medium text-sci-cyan">
                      {streamingContent ? 'AI News Anchor' : 'AI News Anchor is thinking...'}
                    </span>
                  </div>
                  
                  {streamingContent ? (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-2 h-5 bg-sci-cyan ml-1 animate-pulse" />
                      </p>
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sci-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Invisible scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
});

export { ConversationDisplay };