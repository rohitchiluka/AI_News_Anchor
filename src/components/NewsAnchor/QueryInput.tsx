import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, Sparkles, Mic, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  onVoiceInput?: () => void;
  placeholder?: string;
}

const QueryInput = React.memo(function QueryInput({ 
  onSubmit, 
  onVoiceInput,
  placeholder = "Ask me about any news topic..."
}: QueryInputProps) {
  const [query, setQuery] = useState('');
  
  // Get state from store
  const isProcessing = useAppStore((state) => state.isProcessing);
  const isListening = useAppStore((state) => state.isListening);
  const microphoneError = useAppStore((state) => state.microphoneError);

  const disabled = isProcessing || isListening;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-sci-gray-100 bg-sci-black/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex space-x-3 md:space-x-4">
          {/* Voice Input Button */}
          {onVoiceInput && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onVoiceInput}
              disabled={disabled}
              className={`relative p-3 md:p-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 shadow-glow-cyan animate-pulse' 
                  : 'glass-card hover:border-sci-cyan/50'
              }`}
            >
              <Mic className={`w-5 h-5 md:w-6 md:h-6 ${
                isListening ? 'text-sci-white' : 'text-sci-cyan'
              }`} />
              
              {/* Listening Animation */}
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-red-300"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.button>
          )}

          {/* Text Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-sci-cyan/60" />
            </div>
            
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : placeholder}
              disabled={disabled}
              rows={1}
              className={`w-full pl-12 pr-4 py-3 md:py-4 glass-card text-sci-white placeholder-sci-light-gray/60 focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none text-sm md:text-base ${
                isListening ? 'border-sci-cyan/50 bg-sci-cyan/5' : ''
              }`}
              style={{ 
                minHeight: '3rem',
                maxHeight: '8rem',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />

            {/* Listening Indicator Overlay */}
            {isListening && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="flex items-center space-x-2 bg-sci-cyan/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div className="w-2 h-2 bg-sci-cyan rounded-full animate-pulse" />
                  <span className="text-sci-cyan text-sm font-medium">Listening...</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={disabled || !query.trim()}
            className="px-6 py-3 md:px-8 md:py-4 bg-gradient-cyan-to-blue text-sci-white rounded-xl font-semibold hover:shadow-glow-cyan transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isProcessing ? (
              <Loader className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
            ) : (
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            )}
            <span className="hidden sm:inline">Send</span>
          </motion.button>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
          {[
            'Latest tech news',
            'Market updates',
            'Science breakthroughs',
            'Sports highlights',
          ].map((suggestion, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setQuery(suggestion)}
              disabled={disabled}
              className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-sci-cyan/20 text-sci-cyan rounded-full hover:bg-sci-cyan/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </form>

      {/* Error Display at Bottom */}
      <AnimatePresence>
        {microphoneError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-4xl mx-auto mt-4"
          >
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-300 mb-2">Voice Input Error</h4>
                  <p className="text-red-200 leading-relaxed whitespace-pre-line text-sm">
                    {microphoneError}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export { QueryInput };