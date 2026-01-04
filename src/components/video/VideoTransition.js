import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const TransitionContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/**
 * VideoTransition - Видео-переход между сценами
 */
const VideoTransition = ({ src, onComplete, duration = 3000 }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    // Автоматически завершить через duration
    const timer = setTimeout(() => {
      setIsPlaying(false);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <AnimatePresence>
      {isPlaying && (
        <TransitionContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Video
            src={src}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          />
        </TransitionContainer>
      )}
    </AnimatePresence>
  );
};

export default VideoTransition;
