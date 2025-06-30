import React from 'react';
import { NavigationBar } from './layout/NavigationBar';
import { HeroSection } from './landing/HeroSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { TestimonialsSection } from './landing/TestimonialsSection';
import { PricingSection } from './landing/PricingSection';
import { FooterSection } from './layout/FooterSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-sci-black">
      <NavigationBar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <FooterSection />
    </div>
  );
}