import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CustomScrollbar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Always show initially
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // Calculate scroll percentage
  useEffect(() => {
    const updateScrollPercentage = () => {
      // Get the main content container or fallback to document
      const mainContainer = document.querySelector('main') || document.documentElement;
      const scrollTop = mainContainer.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        mainContainer.scrollHeight
      ) - window.innerHeight;

      const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollPercentage(Math.min(100, Math.max(0, percentage)));

      // Always show scrollbar for now
      setIsVisible(true);
    };

    const handleScroll = (e: Event) => {
      // Block scroll events from 3D canvases
      const target = e.target as HTMLElement;
      if (target && (
        target.tagName === 'CANVAS' ||
        target.closest('canvas') ||
        target.closest('[data-r3f-canvas]') ||
        target.classList.contains('r3f-canvas') ||
        target.closest('.r3f')
      )) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      updateScrollPercentage();
    };

    const handleWheel = (e: WheelEvent) => {
      // Block wheel events from canvas elements
      const target = e.target as HTMLElement;
      if (target && (
        target.tagName === 'CANVAS' ||
        target.closest('canvas') ||
        target.closest('[data-r3f-canvas]') ||
        target.classList.contains('r3f-canvas') ||
        target.closest('.r3f')
      )) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    updateScrollPercentage();
    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', updateScrollPercentage, { passive: true });

    // Also listen for scroll on main container
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: false });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateScrollPercentage);
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Handle scrollbar click
  const handleScrollbarClick = (e: React.MouseEvent) => {
    if (!scrollbarRef.current) return;
    
    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollbarHeight = rect.height;
    const percentage = (clickY / scrollbarHeight) * 100;
    
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = (percentage / 100) * scrollHeight;
    
    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  };

  // Handle thumb drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!scrollbarRef.current) return;
      
      const rect = scrollbarRef.current.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const scrollbarHeight = rect.height;
      const percentage = Math.min(100, Math.max(0, (mouseY / scrollbarHeight) * 100));
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScrollTop = (percentage / 100) * scrollHeight;
      
      window.scrollTo({
        top: targetScrollTop,
        behavior: 'auto'
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Calculate thumb height and position
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const thumbHeight = Math.max(20, (viewportHeight / documentHeight) * 100);
  const thumbPosition = scrollPercentage * (100 - thumbHeight) / 100;

  // Show scrollbar when there's scrollable content or force show for visibility
  if (!isVisible && document.documentElement.scrollHeight <= window.innerHeight) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-2 top-4 bottom-4 z-[9999] w-6 flex items-center"
    >
      {/* Scrollbar Track */}
      <div
        ref={scrollbarRef}
        onClick={handleScrollbarClick}
        className="relative w-full bg-black/40 backdrop-blur-sm rounded-full border-2 border-blue-400/50 cursor-pointer hover:bg-black/60 transition-all duration-200 shadow-2xl"
        style={{ height: 'calc(100vh - 2rem)' }}
      >
        {/* Scrollbar Thumb */}
        <motion.div
          ref={thumbRef}
          onMouseDown={handleMouseDown}
          className={`absolute left-0 right-0 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full cursor-grab transition-all duration-200 shadow-2xl border border-white/20 ${
            isDragging ? 'cursor-grabbing bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 shadow-blue-500/50 scale-110' : 'hover:scale-105 hover:shadow-blue-400/40'
          }`}
          style={{
            height: `${thumbHeight}%`,
            top: `${thumbPosition}%`,
            minHeight: '20px'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Thumb Grip Lines */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-1 h-1 bg-white/60 rounded-full mb-0.5"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full mb-0.5"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          </div>
        </motion.div>

        {/* Scroll Progress Indicator */}
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isDragging || scrollPercentage > 0 ? 1 : 0.7,
              scale: isDragging || scrollPercentage > 0 ? 1 : 0.8
            }}
            className="bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm border border-white/20"
          >
            {Math.round(scrollPercentage)}%
          </motion.div>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="absolute -left-12 top-4 flex flex-col gap-2">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Scroll to top"
        >
          <i className="fas fa-chevron-up text-xs"></i>
        </motion.button>
      </div>

      <div className="absolute -left-12 bottom-4 flex flex-col gap-2">
        <motion.button
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
          className="w-8 h-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Scroll to bottom"
        >
          <i className="fas fa-chevron-down text-xs"></i>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CustomScrollbar;
