import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';

interface NewsCategoryDropdownProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
}

const categories = [
  { value: 'all', label: 'All News', icon: '📰' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'science', label: 'Science', icon: '🔬' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'politics', label: 'Politics', icon: '🏛️' },
  { value: 'world', label: 'World News', icon: '🌍' },
];

const NewsCategoryDropdown = React.memo(function NewsCategoryDropdown({ 
  selectedCategory, 
  onCategoryChange, 
  isLoading = false 
}: NewsCategoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory) || categories[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-3 glass-card px-4 py-3 min-w-[200px] justify-between hover:border-sci-cyan/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-sci-cyan" />
          <span className="text-sm">{selectedCategoryData.icon}</span>
          <span className="text-sci-white font-medium">{selectedCategoryData.label}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-sci-light-gray transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-card border border-sci-cyan/30 shadow-glow-cyan z-20 max-h-64 overflow-y-auto"
          >
            {categories.map((category) => (
              <motion.button
                key={category.value}
                whileHover={{ backgroundColor: 'rgba(0, 212, 255, 0.1)' }}
                onClick={() => {
                  onCategoryChange(category.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200 ${
                  selectedCategory === category.value 
                    ? 'bg-sci-cyan/20 text-sci-cyan' 
                    : 'text-sci-white hover:text-sci-cyan'
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
                {selectedCategory === category.value && (
                  <div className="ml-auto w-2 h-2 bg-sci-cyan rounded-full" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
});

export { NewsCategoryDropdown };