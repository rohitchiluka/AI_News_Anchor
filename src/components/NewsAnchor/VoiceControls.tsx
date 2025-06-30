import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  microphoneError: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onOpenSettings: () => void;
}

export function VoiceControls({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  onOpenSettings
}: VoiceControlsProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Voice Control Buttons */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isListening ? onStopListening : onStartListening}
          className={`relative p-4 rounded-full transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
          
          {/* Listening Animation */}
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-red-300"
              animate={{
                scale: [1, 1.3, 1],
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

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStopSpeaking}
          disabled={!isSpeaking}
          className={`p-4 rounded-full transition-all duration-200 ${
            isSpeaking
              ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/30'
              : 'bg-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          {isSpeaking ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSettings}
          className="p-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-all duration-200 shadow-lg shadow-gray-600/30"
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${
          isListening ? 'bg-red-400 animate-pulse' : 'bg-gray-400'
        }`} />
        <span className="text-sci-light-gray">
          {isListening ? 'Listening...' : 'Ready to listen'}
        </span>
      </div>
    </div>
  );
}