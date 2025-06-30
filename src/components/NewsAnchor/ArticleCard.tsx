import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, User, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
    image?: string;
  };
  onSelect?: () => void;
  isSelected?: boolean;
}

const ArticleCard = React.memo(function ArticleCard({ article, onSelect, isSelected = false }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={handleCardClick}
      className={`glass-card p-6 cursor-pointer transition-all duration-300 group ${
        isSelected ? 'ring-2 ring-sci-cyan shadow-glow-cyan' : 'hover:border-sci-cyan/50'
      }`}
    >
      {/* Article Image with Lazy Loading */}
      {article.image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Article Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 text-xs text-sci-light-gray">
          <User className="w-3 h-3" />
          <span className="font-medium">{article.source}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLinkClick}
          className="p-1 rounded-full bg-sci-cyan/20 text-sci-cyan hover:bg-sci-cyan/30 transition-colors"
          title="Open article in new tab"
        >
          <ExternalLink className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Article Title */}
      <h3 className="text-lg font-bold text-sci-white mb-3 line-clamp-2 group-hover:text-sci-cyan transition-colors">
        {article.title}
      </h3>

      {/* Article Description */}
      <p className="text-sci-light-gray text-sm leading-relaxed line-clamp-3 mb-4">
        {article.description || 'No description available.'}
      </p>

      {/* Article Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-sci-gray-100">
        <div className="flex items-center space-x-2 text-xs text-sci-light-gray">
          <Eye className="w-3 h-3" />
          <span>Click to discuss with AI</span>
        </div>
        
        <div className="text-xs text-sci-light-gray">
          {format(publishedDate, 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 left-4 w-6 h-6 bg-sci-cyan rounded-full flex items-center justify-center"
        >
          <div className="w-3 h-3 bg-sci-white rounded-full" />
        </motion.div>
      )}
    </motion.div>
  );
});

export { ArticleCard };