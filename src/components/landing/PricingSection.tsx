import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with AI news',
      features: [
        '10 AI conversations per day',
        'Basic news categories',
        'Text input only',
        'Standard response time',
        'Community support',
      ],
      limitations: [
        'No voice input',
        'Limited conversation history',
        'Basic personalization',
      ],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-sci-gray-200 to-sci-gray-100',
    },
    {
      name: 'Pro',
      icon: Crown,
      price: { monthly: 19, annual: 15 },
      description: 'Advanced features for professionals',
      features: [
        'Unlimited AI conversations',
        'All news categories',
        'Voice & text input',
        'Priority response time',
        'Advanced personalization',
        'Conversation history',
        'Export capabilities',
        'Email support',
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true,
      gradient: 'from-sci-cyan to-sci-blue',
    },
    {
      name: 'Enterprise',
      icon: Building,
      price: { monthly: 99, annual: 79 },
      description: 'Complete solution for organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom news sources',
        'API access',
        'Advanced analytics',
        'White-label options',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-sci-purple to-sci-cyan',
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-black-to-purple">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins mb-4 md:mb-6">
            <span className="gradient-text">Choose Your Plan</span>
          </h2>
          <p className="text-lg md:text-xl text-sci-light-gray max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            Start free and scale as you grow. All plans include our core AI news features 
            with varying levels of access and support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!isAnnual ? 'text-sci-white' : 'text-sci-light-gray'}`}>
              Monthly
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isAnnual ? 'bg-sci-cyan' : 'bg-sci-gray-200'
              }`}
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-sci-white rounded-full shadow-lg"
              />
            </motion.button>
            <span className={`text-sm ${isAnnual ? 'text-sci-white' : 'text-sci-light-gray'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-xs bg-sci-cyan/20 text-sci-cyan px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`glass-card p-6 md:p-8 relative ${
                plan.popular ? 'ring-2 ring-sci-cyan shadow-glow-cyan' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-cyan-to-blue text-sci-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6 md:mb-8">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                  <plan.icon className="w-6 h-6 md:w-8 md:h-8 text-sci-white" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold font-poppins text-sci-white mb-2">
                  {plan.name}
                </h3>
                
                <p className="text-sci-light-gray mb-3 md:mb-4 text-sm md:text-base px-2">
                  {plan.description}
                </p>

                <div className="mb-4 md:mb-6">
                  <span className="text-3xl md:text-4xl font-bold text-sci-white">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-sci-light-gray text-sm md:text-base">
                      /{isAnnual ? 'month' : 'month'}
                    </span>
                  )}
                  {isAnnual && plan.price.monthly > 0 && (
                    <div className="text-xs md:text-sm text-sci-light-gray">
                      Billed annually
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-sci-cyan flex-shrink-0 mt-0.5" />
                    <span className="text-sci-light-gray text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/auth')}
                className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                  plan.popular
                    ? 'sci-button'
                    : 'sci-button-secondary'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 lg:mt-24 text-center"
        >
          <h3 className="text-xl md:text-2xl font-bold font-poppins gradient-text mb-6 md:mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
            {[
              {
                question: 'Can I change plans anytime?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                question: 'Is there a free trial for Pro?',
                answer: 'Yes, we offer a 14-day free trial for the Pro plan with full access to all features.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans, no questions asked.',
              },
            ].map((faq, index) => (
              <div key={index} className="glass-card p-4 md:p-6">
                <h4 className="font-semibold text-sci-white mb-2 text-sm md:text-base">{faq.question}</h4>
                <p className="text-sci-light-gray text-sm md:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}