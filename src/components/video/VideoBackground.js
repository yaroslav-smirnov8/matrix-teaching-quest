import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const VideoContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${props => props.zIndex || 1};
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.opacity || 1};
  filter: ${props => props.filter || 'none'};
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.overlay || 'rgba(0, 0, 0, 0.3)'};
  pointer-events: none;
`;

/**
 * VideoBackground - Фоновое видео для сцен
 */
const VideoBackground = ({
  src,
  opacity = 1,
  overlay = 'rgba(0, 0, 0, 0.3)',
  filter = 'none',
  autoPlay = true,
  loop = false,
  muted = true,
  onEnded,
  zIndex = 1,
  playbackRate = 1,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay blocked:', error);
      });
    }
  }, [src, autoPlay]);

  return (
    <VideoContainer
      zIndex={zIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {src && (
        <StyledVideo
          ref={videoRef}
          src={src}
          opacity={opacity}
          filter={filter}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onEnded={onEnded}
        />
      )}
      {overlay && <Overlay overlay={overlay} />}
    </VideoContainer>
  );
};

export default VideoBackground;
