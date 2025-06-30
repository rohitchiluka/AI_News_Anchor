import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Loader,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface VideoChatComponentProps {
  isActive?: boolean;
  onToggleVideo?: () => void;
  tavusDailyUrl?: string;
  isLoading?: boolean;
  error?: string;
}

export function VideoChatComponent({ 
  isActive = false, 
  onToggleVideo,
  tavusDailyUrl = '',
  isLoading = false,
  error = ''
}: VideoChatComponentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const openInNewTab = () => {
    if (tavusDailyUrl) {
      window.open(tavusDailyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Video Container */}
      <div className="relative aspect-video bg-gradient-to-br from-sci-gray-300 to-sci-black flex items-center justify-center group">
        {/* Tavus Video Iframe */}
        {tavusDailyUrl && isActive ? (
          <div className="absolute inset-0">
            <iframe
              src={tavusDailyUrl}
              className="w-full h-full border-0 rounded-t-xl"
              allow="camera; microphone; fullscreen; speaker; display-capture"
              title="Tavus AI News Anchor"
            />
            
            {/* Open in New Tab Button */}
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openInNewTab}
                className="p-2 bg-sci-black/50 backdrop-blur-sm rounded-lg text-sci-white hover:bg-sci-black/70 transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sci-cyan/10 to-sci-purple/10">
            <div className="w-full h-full flex items-center justify-center">
              {isLoading ? (
                <div className="text-center">
                  <Loader className="w-16 h-16 text-sci-cyan mx-auto mb-4 animate-spin" />
                  <p className="text-sci-white text-lg font-medium">Starting video conversation...</p>
                  <p className="text-sci-light-gray text-sm mt-2">This may take a few moments</p>
                </div>
              ) : error ? (
                <div className="text-center max-w-md px-4">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 text-lg font-medium mb-2">Video Error</p>
                  <p className="text-sci-light-gray text-sm">{error}</p>
                </div>
              ) : isVideoEnabled ? (
                <div className="text-center">
                  {/* AI Avatar Placeholder */}
                  <div className="w-32 h-32 bg-gradient-cyan-to-blue rounded-full flex items-center justify-center shadow-glow-cyan mb-4">
                    <Video className="w-16 h-16 text-sci-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-sci-white mb-2">AI News Anchor</h3>
                  <p className="text-sci-light-gray">
                    {isActive ? 'Ready for conversation' : 'Click activate to start video chat'}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-sci-light-gray mx-auto mb-4" />
                    <p className="text-sci-light-gray">Video is disabled</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Video Controls Overlay - Only show when not using Tavus */}
        {!tavusDailyUrl && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePlayPause}
                className="w-16 h-16 bg-sci-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-sci-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-sci-white" />
                ) : (
                  <Play className="w-8 h-8 text-sci-white ml-1" />
                )}
              </motion.button>
            </div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-sci-black/50 backdrop-blur-sm rounded-lg text-sci-white hover:bg-sci-black/70 transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-sci-black/50 backdrop-blur-sm rounded-lg text-sci-white hover:bg-sci-black/70 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-4 left-4">
          <div className={`flex items-center space-x-2 glass-card px-3 py-2 ${
            isActive ? 'border-green-500/50' : 'border-sci-gray-100'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-green-400 animate-pulse' : 'bg-sci-light-gray'
            }`} />
            <span className="text-xs text-sci-white font-medium">
              {isLoading ? 'Connecting...' : isActive ? 'AI Active' : 'AI Standby'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="p-4 space-y-4">
        {/* Primary Controls - Only show when not using Tavus */}
        {!tavusDailyUrl && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-lg transition-colors ${
                  isVideoEnabled 
                    ? 'bg-sci-cyan text-sci-white' 
                    : 'bg-red-500 text-sci-white'
                }`}
              >
                {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMicEnabled(!isMicEnabled)}
                className={`p-3 rounded-lg transition-colors ${
                  isMicEnabled 
                    ? 'bg-sci-cyan text-sci-white' 
                    : 'bg-red-500 text-sci-white'
                }`}
              >
                {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </motion.button>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMuteToggle}
                className="p-2 text-sci-light-gray hover:text-sci-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </motion.button>

              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-sci-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-sci-light-gray w-8">{isMuted ? 0 : volume}%</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Status */}
        <div className="glass-card p-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-sci-white mb-1">AI News Anchor</h4>
              <p className="text-xs text-sci-light-gray">
                {isLoading 
                  ? 'Setting up video conversation...' 
                  : error 
                    ? 'Error occurred - please try again'
                    : isActive 
                      ? tavusDailyUrl 
                        ? 'Video conversation active - interact directly in the video'
                        : 'Ready to answer your questions'
                      : 'Click to activate conversation'
                }
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleVideo}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive 
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'bg-sci-cyan/20 text-sci-cyan hover:bg-sci-cyan/30'
              }`}
            >
              {isLoading ? 'Starting...' : isActive ? 'Deactivate' : 'Activate'}
            </motion.button>
          </div>
        </div>

        {/* Tavus Integration Status */}
        <div className="text-center">
          <p className="text-xs text-sci-light-gray/60">
            {tavusDailyUrl 
              ? '🎥 Tavus CVI Active - Full conversational video experience'
              : '💡 Tavus CVI Ready - Click activate to start video conversation'
            }
          </p>
        </div>
      </div>
    </div>
  );
}