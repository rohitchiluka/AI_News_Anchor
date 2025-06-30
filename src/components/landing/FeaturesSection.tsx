import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Video, 
  Mic, 
  Zap, 
  Globe, 
  Smartphone,
  Brain,
  Clock
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Video,
      title: 'AI Conversational Video Interface',
      description: 'Interact with our AI news anchor through natural video conversations. Ask questions and get personalized responses in real-time.',
      gradient: 'from-sci-cyan to-sci-blue',
    },
    {
      icon: Brain,
      title: 'Smart News Categorization',
      description: 'Our AI automatically categorizes and curates news based on your interests and reading patterns for a personalized experience.',
      gradient: 'from-sci-blue to-sci-purple',
    },
    {
      icon: Mic,
      title: 'Voice & Text Input',
      description: 'Seamlessly switch between voice commands and text input. Our advanced speech recognition understands natural language.',
      gradient: 'from-sci-purple to-sci-cyan',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay ahead with instant news updates and breaking stories delivered the moment they happen, 24/7.',
      gradient: 'from-sci-cyan to-sci-blue',
    },
    {
      icon: MessageSquare,
      title: 'Personalized Content',
      description: 'Get news tailored to your interests, location, and preferences. Our AI learns what matters most to you.',
      gradient: 'from-sci-blue to-sci-purple',
    },
    {
      icon: Smartphone,
      title: 'Multi-platform Access',
      description: 'Access your personalized news experience across all devices - desktop, mobile, tablet, and smart speakers.',
      gradient: 'from-sci-purple to-sci-cyan',
    },
  ];

  return (
    <section id="features" className="section-padding bg-gradient-black-to-dark-blue">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins mb-4 md:mb-6">
            <span className="gradient-text">Revolutionary Features</span>
          </h2>
          <p className="text-lg md:text-xl text-sci-light-gray max-w-3xl mx-auto px-4">
            Experience the next generation of news consumption with cutting-edge AI technology 
            that adapts to your needs and preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 md:p-8 group cursor-pointer"
            >
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:shadow-glow-cyan transition-all duration-300`}>
                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-sci-white" />
              </div>
              
              <h3 className="text-lg md:text-xl font-bold font-poppins text-sci-white mb-3 md:mb-4 group-hover:text-sci-cyan transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-sci-light-gray leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Additional Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 lg:mt-24 glass-card p-8 md:p-12 text-center"
        >
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-cyan-to-blue rounded-full flex items-center justify-center shadow-glow-cyan">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-sci-white" />
            </div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold font-poppins gradient-text mb-3 md:mb-4">
            Powered by Advanced AI
          </h3>
          
          <p className="text-lg md:text-xl text-sci-light-gray max-w-2xl mx-auto px-4">
            Our proprietary AI technology processes millions of news sources in real-time, 
            delivering accurate, relevant, and personalized news experiences that evolve with you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}