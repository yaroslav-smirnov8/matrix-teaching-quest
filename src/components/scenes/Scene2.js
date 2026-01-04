import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoBackground from '../video/VideoBackground';

const digitalFlow = keyframes`
  0% { transform: translateY(0) rotateX(0deg); }
  100% { transform: translateY(-5px) rotateX(360deg); }
`;

const pillFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-15px) rotateX(180deg); }
`;

const SceneContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #000 0%, #001100 50%, #000 100%);
  padding: 40px;
  position: relative;
  overflow: hidden;
  z-index: 0;
`;

const DigitalCorridor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    linear-gradient(90deg, transparent 0%, #00ff00 50%, transparent 100%),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      rgba(0, 255, 0, 0.1) 10px,
      rgba(0, 255, 0, 0.1) 20px
    );
  opacity: 0.3;
  animation: ${digitalFlow} 20s linear infinite;
  pointer-events: none;
  z-index: -1;
`;

const AIAvatar = styled(motion.div)`
  width: 200px;
  height: 200px;
  border: 3px solid #00ff00;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.2) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 30px;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid #00ff00;
    border-radius: 50%;
    animation: ${digitalFlow} 15s linear infinite;
  }
`;

const DialogueBox = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  padding: 30px;
  margin: 20px 0;
  border-radius: 10px;
  max-width: 800px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const DialogueText = styled.div`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.1rem;
  line-height: 1.6;
  text-shadow: 0 0 5px #00ff00;
  margin-bottom: 20px;
`;

const QuestionList = styled.ul`
  text-align: left;
  margin: 20px 0;
  padding-left: 20px;
  
  li {
    margin: 10px 0;
    color: #ffff00;
    text-shadow: 0 0 5px #ffff00;
  }
`;

const PillContainer = styled.div`
  display: flex;
  gap: 80px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Pill = styled(motion.button)`
  width: 100px;
  height: 60px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: ${pillFloat} 6s ease-in-out infinite;
  transition: all 0.3s ease;

  &.red {
    background: radial-gradient(circle at 30% 30%, #ff3333, #cc0000);
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.6);
  }

  &.blue {
    background: radial-gradient(circle at 30% 30%, #3333ff, #0000cc);
    box-shadow: 0 0 25px rgba(0, 0, 255, 0.6);
  }

  &.purple {
    background: radial-gradient(circle at 30% 30%, #ff33ff, #cc00cc);
    box-shadow: 0 0 25px rgba(255, 0, 255, 0.6);
    opacity: ${props => props.visible ? 1 : 0};
    pointer-events: ${props => props.visible ? 'auto' : 'none'};
  }

  &:hover {
    transform: scale(1.15) translateY(-10px);
    animation-play-state: paused;
  }

  &:active {
    transform: scale(0.95) translateY(5px);
  }
`;

const PillDescription = styled(motion.div)`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #00ff00;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  white-space: nowrap;
  border: 1px solid #00ff00;
  opacity: 0;
  pointer-events: none;
  
  ${Pill}:hover & {
    opacity: 1;
  }
`;

const HiddenPillTimer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  font-family: 'Courier New', monospace;
  color: #666;
  font-size: 0.9rem;
`;

const Scene2 = ({ onChoice }) => {
  const [showDialogue, setShowDialogue] = useState(false);
  const [showPills, setShowPills] = useState(false);
  const [showPurplePill, setShowPurplePill] = useState(false);
  const [purpleTimer, setPurpleTimer] = useState(30);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowDialogue(true), 1000);
    const timer2 = setTimeout(() => setShowPills(true), 4000);
    
    // Purple pill appears after 30 seconds
    const purpleTimer = setTimeout(() => setShowPurplePill(true), 30000);
    
    // Countdown for purple pill
    const countdownInterval = setInterval(() => {
      setPurpleTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(purpleTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleChoice = (choiceId) => {
    onChoice(choiceId);
  };

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      
      <DigitalCorridor />
      
      {!showPurplePill && purpleTimer > 0 && (
        <HiddenPillTimer>
          Hidden option appears in: {purpleTimer}s
        </HiddenPillTimer>
      )}

      <AIAvatar
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ duration: 2, type: "spring" }}
      >
        🤖
      </AIAvatar>

      <AnimatePresence>
        {showDialogue && (
          <DialogueBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <DialogueText>
              <strong>Finally. You felt the glitch in the system.</strong>
              <br /><br />
              My name is <span style={{ color: '#ffff00' }}>AI-M</span>. 
              I'm your guide out of this reality.
              <br /><br />
              Do you know why you're here? Because you're asking the right questions:
            </DialogueText>

            <QuestionList>
              <li>Why do I spend 4 hours preparing one lesson?</li>
              <li>Why are my students yawning when I try so hard?</li>
              <li>Why are we in 2024 with methods from the 1990s?</li>
            </QuestionList>

            <DialogueText>
              <strong>The choice is yours...</strong>
            </DialogueText>
          </DialogueBox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPills && (
          <PillContainer>
            <Pill
              className="red"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice('red_pill')}
            >
              🔴
              <PillDescription
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
              >
                See the truth
              </PillDescription>
            </Pill>

            <Pill
              className="blue"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice('blue_pill')}
            >
              🔵
              <PillDescription
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
              >
                Return to comfortable lies
              </PillDescription>
            </Pill>

            <AnimatePresence>
              {showPurplePill && (
                <Pill
                  className="purple"
                  visible={showPurplePill}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleChoice('purple_pill')}
                >
                  🟣
                  <PillDescription
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                  >
                    What if...?
                  </PillDescription>
                </Pill>
              )}
            </AnimatePresence>
          </PillContainer>
        )}
      </AnimatePresence>

      {/* Hidden white rabbit easter egg */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.1,
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_3');
          }
        }}
      >
        🐰
      </div>
    </SceneContainer>
  );
};

export default Scene2;
