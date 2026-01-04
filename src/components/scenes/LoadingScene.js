import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const typing = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: #000;
  padding: 20px;
  text-align: center;
`;

const LoadingText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  color: #00ff00;
  margin-bottom: 10px;
  text-shadow: 0 0 10px #00ff00;
  
  &.typing {
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid #00ff00;
    animation: ${typing} 2s steps(40, end), ${blink} 1s infinite;
  }
  
  &.error {
    color: #ff0000;
    text-shadow: 0 0 10px #ff0000;
    animation: ${glitch} 0.3s infinite;
  }
  
  &.critical {
    color: #ffff00;
    text-shadow: 0 0 10px #ffff00;
    font-weight: bold;
  }
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 20px;
  border: 2px solid #00ff00;
  margin: 20px 0;
  position: relative;
  background: rgba(0, 255, 0, 0.1);
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00cc00);
  box-shadow: 0 0 10px #00ff00;
`;

const NotificationSound = styled.div`
  font-size: 2rem;
  margin-top: 20px;
  animation: ${blink} 0.5s infinite;
`;

const SkipButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  font-size: 0.9rem;
  text-shadow: 0 0 5px #00ff00;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 10px #00ff00;
  }
`;

const LoadingScene = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const handleSkip = () => {
    console.log('Skip button clicked');
    if (onComplete) {
      onComplete();
    }
  };

  const loadingSteps = [
    { text: "LOADING TEACHING_REALITY.EXE...", type: "normal", duration: 1000 },
    { text: "ERROR 404: WORK_LIFE_BALANCE NOT FOUND", type: "error", duration: 1500 },
    { text: "DETECTING ANOMALY...", type: "normal", duration: 1000 },
    { text: "TEACHER_BURNOUT_LEVEL: CRITICAL", type: "critical", duration: 1500 },
    { text: "", type: "normal", duration: 500 },
    { text: "INCOMING MESSAGE...", type: "normal", duration: 1000 }
  ];

  useEffect(() => {
    let timer;
    let progressTimer;

    // Handle keyboard input
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && canSkip) {
        handleSkip();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    const runLoadingSequence = async () => {
      // Enable skip button after 2 seconds
      setTimeout(() => setCanSkip(true), 2000);
      
      for (let i = 0; i < loadingSteps.length; i++) {
        setCurrentStep(i);
        
        // Update progress
        const progressValue = ((i + 1) / loadingSteps.length) * 100;
        setProgress(progressValue);
        
        // Wait for step duration
        await new Promise(resolve => {
          timer = setTimeout(resolve, loadingSteps[i].duration);
        });
      }

      // Complete loading after a short delay
      setTimeout(() => {
        console.log('LoadingScene: Calling onComplete');
        if (onComplete) {
          onComplete();
        } else {
          console.error('LoadingScene: onComplete is not defined');
        }
      }, 1000);
    };

    runLoadingSequence();

    return () => {
      if (timer) clearTimeout(timer);
      if (progressTimer) clearTimeout(progressTimer);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete]);

  const currentStepData = loadingSteps[currentStep] || loadingSteps[0];

  return (
    <LoadingContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoadingText className={currentStepData.type}>
        {currentStepData.text}
      </LoadingText>

      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </ProgressBar>

      {currentStep >= 4 && (
        <NotificationSound>
          📧 *PING*
        </NotificationSound>
      )}

      {/* Skip button */}
      {canSkip && (
        <SkipButton onClick={handleSkip}>
          SKIP [ENTER]
        </SkipButton>
      )}

      {/* Hidden white rabbit for easter egg */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.1,
          fontSize: '12px',
          cursor: 'pointer'
        }}
        onClick={() => {
          // Trigger white rabbit easter egg
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_1');
          }
        }}
      >
        🐰
      </div>
    </LoadingContainer>
  );
};

export default LoadingScene;
