import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
`;

const NotificationContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 20px;
  min-width: 300px;
  max-width: 400px;
  animation: ${slideIn} 0.5s ease-out, ${glow} 2s ease-in-out infinite;
  backdrop-filter: blur(10px);
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 10px;
`;

const AchievementTitle = styled.h3`
  font-family: 'Courier New', monospace;
  color: #ffd700;
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  text-align: center;
  text-shadow: 0 0 10px #ffd700;
`;

const AchievementDescription = styled.p`
  font-family: 'Courier New', monospace;
  color: #ffff00;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: #ffd700;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const achievements = {
  glitch_hunter: {
    icon: '🔍',
    title: 'Glitch Hunter',
    description: 'All hidden glitches found in the system'
  },
  speed_runner: {
    icon: '⚡',
    title: 'Speed Runner',
    description: 'Quest completed in less than 5 minutes'
  },
  perfect_code: {
    icon: '💎',
    title: 'Perfect Code',
    description: 'Quest completed without a single mistake'
  },
  evangelist: {
    icon: '📢',
    title: 'Evangelist',
    description: 'Quest shared with friends'
  },
  white_rabbit_collector: {
    icon: '🐰',
    title: 'White Rabbit Collector',
    description: 'All white rabbits found'
  },
  matrix_master: {
    icon: '👑',
    title: 'Matrix Master',
    description: 'All achievements obtained'
  },
  deja_vu: {
    icon: '🐱',
    title: 'Deja Vu',
    description: 'Black cat spotted twice'
  },
  spoon_bender: {
    icon: '🥄',
    title: 'Spoon Bender',
    description: 'Secret phrase found'
  },
  code_breaker: {
    icon: '🔓',
    title: 'Code Breaker',
    description: 'Secret code solved'
  }
};

const AchievementNotification = ({ achievement, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const achievementData = achievements[achievement] || {
    icon: '🏆',
    title: 'Achievement Unlocked!',
    description: achievement
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationContainer
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <CloseButton onClick={handleClose}>×</CloseButton>
          <AchievementIcon>{achievementData.icon}</AchievementIcon>
          <AchievementTitle>{achievementData.title}</AchievementTitle>
          <AchievementDescription>{achievementData.description}</AchievementDescription>
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
