import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';

interface ScrollNavigationProps {
  sections?: string[];
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({ 
  sections = ['overview', 'metrics', 'insights', 'analytics', 'visualization'] 
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Show scroll to top button after scrolling down
      setShowScrollTop(scrollPosition > windowHeight * 0.3);
      
      // Determine active section based on scroll position
      const sectionHeight = windowHeight / sections.length;
      const currentSection = Math.min(
        Math.floor(scrollPosition / sectionHeight),
        sections.length - 1
      );
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    const windowHeight = window.innerHeight;
    const targetPosition = index * (windowHeight / sections.length);
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Section Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        {sections.map((section, index) => (
          <motion.button
            key={section}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === index
                ? 'bg-blue-400 border-blue-400 shadow-lg shadow-blue-400/50'
                : 'bg-transparent border-white/40 hover:border-white/80'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
      </div>

      {/* Scroll Controls */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                onClick={scrollToTop}
                size="sm"
                className="w-12 h-12 rounded-full bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm border border-white/20 shadow-lg"
                title="Scroll to top"
              >
                <i className="fas fa-chevron-up text-white"></i>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={scrollToBottom}
          size="sm"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg"
          title="Scroll to bottom"
        >
          <i className="fas fa-chevron-down text-white"></i>
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
          style={{
            width: `${(activeSection / (sections.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </>
  );
};

export default ScrollNavigation;