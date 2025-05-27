
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface OptimizedCharacterImageProps {
  src: string;
  alt: string;
  className?: string;
  preloadNext?: string;
}

export const OptimizedCharacterImage: React.FC<OptimizedCharacterImageProps> = React.memo(({ 
  src, 
  alt, 
  className = "w-full h-auto object-contain max-h-80",
  preloadNext 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    // Preload next image if provided
    if (preloadNext) {
      const img = new Image();
      img.src = preloadNext;
    }
  }, [preloadNext]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
      />
      {!isLoaded && (
        <div className={`${className} bg-gray-100 animate-pulse rounded-lg absolute inset-0`} />
      )}
    </motion.div>
  );
});

OptimizedCharacterImage.displayName = 'OptimizedCharacterImage';
