import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-sci-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-sci-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-128 md:h-128 bg-sci-blue/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container-max relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6 md:space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-2 glass-card px-3 py-2 md:px-4 md:py-2"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-sci-cyan" />
            <span className="text-xs md:text-sm font-medium text-sci-light-gray">
              Powered by Advanced AI Technology
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 md:space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-poppins leading-tight">
              <span className="text-sci-white">The Future of</span>
              <br />
              <span className="gradient-text text-shadow-glow">AI News</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-sci-light-gray max-w-3xl mx-auto leading-relaxed px-4">
              Experience news like never before with our conversational AI anchor. 
              Get personalized updates, ask questions, and dive deep into stories that matter to you.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/auth')}
              className="sci-button flex items-center space-x-2 text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto justify-center"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sci-button-secondary flex items-center space-x-2 text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto justify-center"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5" />
              <span>Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 pt-12 md:pt-16 border-t border-sci-gray-100 px-4"
          >
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '1M+', label: 'News Articles Processed' },
              { number: '99.9%', label: 'Uptime Reliability' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text font-poppins">
                  {stat.number}
                </div>
                <div className="text-sci-light-gray mt-2 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}