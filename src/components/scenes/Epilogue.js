import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import VideoBackground from '../video/VideoBackground';

const codeScroll = keyframes`
  0% { transform: translateY(100vh); }
  100% { transform: translateY(-100vh); }
`;

const matrixGlow = keyframes`
  0%, 100% { text-shadow: 0 0 5px #00ff00; }
  50% { text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00; }
`;

const SceneContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #000;
  padding: 40px;
  position: relative;
  overflow: hidden;
  z-index: 0;
`;

const CodeBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #00ff00;
  opacity: 0.3;
  z-index: 1;
  pointer-events: none; /* Don't block clicks */

  &::before {
    content: 'REALITY.EXE SUCCESSFULLY UPDATED\\ATEACHER_STATUS: EVOLVED\\AAI_INTEGRATION: READY\\A\\AWelcome to the real world.\\AYour training begins September 16.\\A\\ARemember: There is no workbook.';
    white-space: pre;
    animation: ${codeScroll} 20s linear infinite;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
`;

const SuccessMessage = styled(motion.div)`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-shadow: 0 0 10px #00ff00;
  animation: ${matrixGlow} 3s ease-in-out infinite;
`;

const StatusUpdate = styled(motion.div)`
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  text-align: left;
`;

const PromoCodeDisplay = styled(motion.div)`
  background: rgba(255, 0, 0, 0.1);
  border: 3px solid #ff0000;
  padding: 25px;
  margin: 30px 0;
  border-radius: 15px;
  text-align: center;
`;

const PromoCodeText = styled.div`
  font-family: 'Courier New', monospace;
  color: #ff0000;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 0 15px #ff0000;
  margin-bottom: 10px;
`;

const CourseButton = styled(motion.button)`
  background: linear-gradient(45deg, #00ff00, #00cc00);
  border: none;
  color: #000;
  padding: 20px 40px;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 10px;
  margin: 20px 0;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 50px rgba(0, 255, 0, 0.8);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const FinalMessage = styled(motion.div)`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 30px;
  text-shadow: 0 0 5px #00ff00;
`;

const CountdownTimer = styled.div`
  font-family: 'Courier New', monospace;
  color: #ffff00;
  font-size: 1.3rem;
  margin: 20px 0;
  text-shadow: 0 0 10px #ffff00;
`;

const AchievementSummary = styled(motion.div)`
  background: rgba(255, 255, 0, 0.1);
  border: 2px solid #ffff00;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  color: #ffff00;
`;

const Epilogue = () => {
  const [promoCode, setPromoCode] = useState('');
  const [courseUrl, setCourseUrl] = useState('');
  const [countdown, setCountdown] = useState('');
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Get promo code from localStorage
    const savedPromoCode = localStorage.getItem('matrix_promo_code');
    if (savedPromoCode) {
      setPromoCode(savedPromoCode);
      setCourseUrl(`https://your-course-platform.com?promo=${savedPromoCode}`);
    }

    // Calculate countdown to September 16
    const targetDate = new Date('2024-09-16T00:00:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else {
        setCountdown('COURSE STARTED!');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    // Load user achievements
    const userAchievements = JSON.parse(localStorage.getItem('matrix_achievements') || '[]');
    setAchievements(userAchievements);

    return () => clearInterval(interval);
  }, []);

  const handleCourseRedirect = () => {
    if (courseUrl) {
      window.open(courseUrl, '_blank');
    }
    
    // If Telegram WebApp, close the app
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  const shareQuest = () => {
    const shareText = 'I completed the Matrix Teaching Quest and got a promo code for the course! Try it too: [quest link]';
    
    if (navigator.share) {
      navigator.share({
        title: 'Matrix Teaching Quest',
        text: shareText,
        url: window.location.href
      });
    } else if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`);
    }
  };

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      
      <CodeBackground />
      
      <ContentContainer>
        <SuccessMessage
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          REALITY.EXE SUCCESSFULLY UPDATED
        </SuccessMessage>

        <StatusUpdate
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div>TEACHER_STATUS: EVOLVED ✓</div>
          <div>AI_INTEGRATION: READY ✓</div>
          <div>MATRIX_ESCAPE: SUCCESSFUL ✓</div>
        </StatusUpdate>

        {achievements.length > 0 && (
          <AchievementSummary
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              ACHIEVEMENTS UNLOCKED:
            </div>
            {achievements.map((achievement, index) => (
              <div key={index}>• {achievement}</div>
            ))}
          </AchievementSummary>
        )}

        {promoCode && (
          <PromoCodeDisplay
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.5, type: "spring" }}
          >
            <div style={{ color: '#ff0000', marginBottom: '10px' }}>
              YOUR PROMO CODE:
            </div>
            <PromoCodeText>{promoCode}</PromoCodeText>
            <div style={{ color: '#ff0000', fontSize: '0.9rem' }}>
              Save it! Discount valid for limited time.
            </div>
          </PromoCodeDisplay>
        )}

        <CountdownTimer>
          Training starts in: {countdown}
        </CountdownTimer>

        <CourseButton
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCourseRedirect}
        >
          GO TO COURSE
        </CourseButton>

        <CourseButton
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 3.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareQuest}
          style={{ 
            background: 'linear-gradient(45deg, #0088ff, #0066cc)',
            marginLeft: '20px'
          }}
        >
          SHARE QUEST
        </CourseButton>

        <FinalMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          <div style={{ fontSize: '1.3rem', marginBottom: '20px' }}>
            Welcome to the real world.
          </div>
          <div>
            You made the choice. The Matrix no longer owns you.
            <br />
            See you on the other side.
            <br /><br />
            <span style={{ color: '#ffff00' }}>
              — Yaroslav 'Neo' and AI-M
            </span>
          </div>
          <div style={{ marginTop: '30px', fontSize: '0.9rem', opacity: 0.7 }}>
            Remember: There is no workbook.
          </div>
        </FinalMessage>
      </ContentContainer>

      {/* Final white rabbit easter egg */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.3,
          fontSize: '20px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_final');
          }
        }}
      >
        🐰✨
      </div>
    </SceneContainer>
  );
};

export default Epilogue;
