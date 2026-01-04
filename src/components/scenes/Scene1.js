import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import VideoBackground from '../video/VideoBackground';

const flicker = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  75% { opacity: 0.9; }
`;

const terminalCursor = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
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
  z-index: 0;
`;

const LaptopView = styled.div`
  width: 80%;
  max-width: 800px;
  background: #111;
  border: 3px solid #333;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 40px;
  animation: ${flicker} 3s infinite;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.2rem;
  text-shadow: 0 0 10px #00ff00;
`;

const StoryText = styled.div`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  text-shadow: 0 0 5px #00ff00;
  text-align: center;
`;

const TerminalWindow = styled.div`
  background: #000;
  border: 2px solid #00ff00;
  padding: 15px;
  margin: 20px 0;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  position: relative;
`;

const TerminalText = styled.div`
  margin-bottom: 10px;
  
  &::after {
    content: '█';
    animation: ${terminalCursor} 1s infinite;
    margin-left: 5px;
  }
`;

const MessageBox = styled(motion.div)`
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
  text-align: center;
`;

const WhiteRabbit = styled(motion.div)`
  font-size: 2rem;
  position: absolute;
  right: 50px;
  bottom: 100px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const ChoiceContainer = styled.div`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 99999;
  pointer-events: auto;
`;

const ChoiceButton = styled.button`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 15px 30px;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  cursor: pointer;
  text-shadow: 0 0 5px #00ff00;
  transition: all 0.3s ease;
  z-index: 100000;
  position: relative;
  pointer-events: auto;
  border-radius: 5px;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const LoopEffect = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ff0000;
  text-shadow: 0 0 20px #ff0000;
`;

const Scene1 = ({ onChoice, variant = 'normal' }) => {
  const [showRabbit, setShowRabbit] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [isLoop, setIsLoop] = useState(variant === 'loop');

  useEffect(() => {
    console.log('Scene1: useEffect triggered, variant:', variant);
    if (variant === 'loop') {
      // Show loop effect for 3 seconds then return to normal
      const timer = setTimeout(() => {
        console.log('Scene1: Loop timer finished, setting isLoop to false');
        setIsLoop(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Normal scene progression
      const timer1 = setTimeout(() => {
        console.log('Scene1: Showing rabbit');
        setShowRabbit(true);
      }, 2000);
      const timer2 = setTimeout(() => {
        console.log('Scene1: Showing choices');
        setShowChoices(true);
      }, 3000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [variant]);

  const handleChoice = (choiceId) => {
    console.log('Scene1: Button clicked, choiceId:', choiceId);
    console.log('Scene1: onChoice function:', onChoice);
    if (onChoice) {
      onChoice(choiceId);
    } else {
      console.error('Scene1: onChoice is not defined!');
    }
  };

  const handleRabbitClick = () => {
    // Easter egg: white rabbit found
    if (window.triggerEasterEgg) {
      window.triggerEasterEgg('white_rabbit_2');
    }
  };

  if (isLoop) {
    return (
      <SceneContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoopEffect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          LOOP DETECTED
          <br />
          <div style={{ fontSize: '1rem', marginTop: '20px' }}>
            You chose to stay. But the Matrix won't let go that easily...
          </div>
        </LoopEffect>
      </SceneContainer>
    );
  }

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      
      <TimeDisplay>23:47</TimeDisplay>

      <LaptopView>
        <StoryText>
          Do you feel it?
          <br />
          This endless loop...
          <br />
          <br />
          <span style={{ color: '#ffff00' }}>
            Lesson plans → Grading → Preparation → Plans again...
          </span>
          <br />
          <br />
          Are you tired of living in this simulation?
        </StoryText>

        <TerminalWindow>
          <TerminalText>
            SYSTEM: Message detected from Unknown_User
          </TerminalText>
        </TerminalWindow>

        <MessageBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Follow the white rabbit 🐰
          </div>
        </MessageBox>
      </LaptopView>

      <AnimatePresence>
        {showRabbit && (
          <WhiteRabbit
            key="white-rabbit"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 10 }}
            onClick={handleRabbitClick}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            🐰
          </WhiteRabbit>
        )}
      </AnimatePresence>

      {showChoices && (
        <ChoiceContainer>
            <ChoiceButton
              onClick={() => {
                console.log('Scene1: FIRST BUTTON CLICKED!');
                handleChoice('follow_rabbit');
              }}
              onMouseEnter={() => console.log('Scene1: Mouse entered first button')}
              onMouseLeave={() => console.log('Scene1: Mouse left first button')}
            >
              🐰 Follow the rabbit
            </ChoiceButton>

            <ChoiceButton
              onClick={() => handleChoice('close_message')}
            >
              ❌ Close message
            </ChoiceButton>
          </ChoiceContainer>
      )}

      {/* Hidden easter egg - black cat */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          opacity: 0.05,
          fontSize: '20px',
          cursor: 'pointer',
          pointerEvents: 'none',
          zIndex: 1
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('black_cat_click');
          }
        }}
      >
        🐱
      </div>
    </SceneContainer>
  );
};

export default Scene1;
