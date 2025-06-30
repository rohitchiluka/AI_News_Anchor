import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Tech Journalist',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'Intellect has completely transformed how I consume news. The AI anchor feels like having a personal news assistant that understands exactly what I need to know.',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Business Executive',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'The conversational interface is incredible. I can ask follow-up questions and get detailed explanations. It\'s like having a knowledgeable news anchor available 24/7.',
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Research Scientist',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'The accuracy and depth of analysis is impressive. Intellect helps me stay updated on scientific breakthroughs and their implications in ways traditional news never could.',
    },
    {
      name: 'James Thompson',
      role: 'Financial Analyst',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'Real-time market updates with AI-powered analysis have given me a significant edge. The personalization is spot-on for my investment research needs.',
    },
    {
      name: 'Lisa Park',
      role: 'Marketing Director',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'I love how I can get news updates while multitasking. The voice interface is so natural, and the summaries are perfect for my busy schedule.',
    },
    {
      name: 'David Kim',
      role: 'Software Developer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5,
      content: 'The technology behind Intellect is fascinating. The AI understands context and nuance in a way that feels genuinely intelligent. It\'s the future of news.',
    },
  ];

  return (
    <section id="testimonials" className="section-padding">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins mb-4 md:mb-6">
            <span className="gradient-text">What Our Users Say</span>
          </h2>
          <p className="text-lg md:text-xl text-sci-light-gray max-w-3xl mx-auto px-4">
            Join thousands of professionals who have revolutionized their news consumption 
            with Intellect's AI-powered platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 md:p-8 group cursor-pointer relative"
            >
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-sci-cyan/30 group-hover:text-sci-cyan/60 transition-colors">
                <Quote className="w-6 h-6 md:w-8 md:h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3 md:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sci-light-gray leading-relaxed mb-4 md:mb-6 italic text-sm md:text-base">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3 md:space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-sci-cyan/30 group-hover:border-sci-cyan transition-colors"
                />
                <div>
                  <h4 className="font-semibold text-sci-white group-hover:text-sci-cyan transition-colors text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs md:text-sm text-sci-light-gray">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 lg:mt-24 text-center"
        >
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold font-poppins gradient-text mb-4 md:mb-6">
              Trusted by Industry Leaders
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center opacity-60">
              {['TechCorp', 'NewsFlow', 'DataSync', 'MediaHub'].map((company, index) => (
                <div key={index} className="text-sci-light-gray font-semibold text-base md:text-lg">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}