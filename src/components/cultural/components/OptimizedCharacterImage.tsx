
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
  const [imgSrc, setImgSrc] = useState(src);

  // Fallback image - using the default cultural assessment image
  const fallbackImage = '/lovable-uploads/4d2abc22-b792-462b-8247-6cc413c71b23.png';

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    console.log('Character image loaded successfully:', imgSrc);
    
    // Preload next image if provided
    if (preloadNext && preloadNext !== imgSrc) {
      const img = new Image();
      img.src = preloadNext;
    }
  }, [preloadNext, imgSrc]);

  const handleError = useCallback(() => {
    console.warn('Character image failed to load:', imgSrc);
    if (imgSrc !== fallbackImage) {
      console.log('Switching to fallback image:', fallbackImage);
      setImgSrc(fallbackImage);
      setHasError(false);
      setIsLoaded(false);
    } else {
      console.error('Fallback image also failed to load');
      setHasError(true);
    }
  }, [imgSrc, fallbackImage]);

  // Update src when prop changes
  React.useEffect(() => {
    if (src !== imgSrc && !hasError) {
      setImgSrc(src);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, imgSrc, hasError]);

  // If all images fail, show a styled placeholder
  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center border border-purple-200`}>
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-purple-200 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-purple-600 text-sm font-medium">Assessment Guide</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg flex items-center justify-center`}>
          <div className="w-8 h-8 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        transition={{ duration: 0.3 }}
        className={isLoaded ? "relative" : "absolute inset-0"}
      >
        <img
          src={imgSrc}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          loading="eager"
          decoding="async"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
      </motion.div>
    </div>
  );
});

OptimizedCharacterImage.displayName = 'OptimizedCharacterImage';
