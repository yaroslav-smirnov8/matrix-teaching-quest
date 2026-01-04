import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const dojoGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(0, 255, 0, 0.3); }
  50% { box-shadow: 0 0 60px rgba(0, 255, 0, 0.6); }
`;

const hologramFlicker = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const SceneContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #000 0%, #001100 50%, #000 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const DojoEnvironment = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 30% 70%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(0, 255, 0, 0.1) 0%, transparent 50%);
  animation: ${dojoGlow} 4s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
`;

const HolographicStudent = styled(motion.div)`
  width: 150px;
  height: 200px;
  border: 2px solid #00ff00;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
  animation: ${hologramFlicker} 2s ease-in-out infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 1px solid #00ff00;
    border-radius: 10px;
    opacity: 0.5;
  }
`;

const StudentAvatar = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const StudentData = styled.div`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
`;

const ChallengeTitle = styled(motion.h2)`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 2rem;
  text-align: center;
  text-shadow: 0 0 20px #00ff00;
  margin-bottom: 20px;
`;

const InstructionBox = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #00ff00;
  padding: 25px;
  margin: 20px 0;
  border-radius: 10px;
  max-width: 900px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const InstructionText = styled.div`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  max-width: 800px;
  width: 100%;
`;

const PromptChoice = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  transition: all 0.3s ease;
  line-height: 1.4;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
    transform: translateX(10px);
  }
  
  &.correct {
    border-color: #00ff00;
    background: rgba(0, 255, 0, 0.2);
  }
  
  &.incorrect {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.1);
  }
`;

const FeedbackBox = styled(motion.div)`
  background: ${props => props.correct ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  border: 2px solid ${props => props.correct ? '#00ff00' : '#ff0000'};
  color: ${props => props.correct ? '#00ff00' : '#ff0000'};
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
`;

const EngagementMeter = styled.div`
  width: 200px;
  height: 20px;
  border: 2px solid #00ff00;
  margin: 15px auto;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
`;

const EngagementFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00);
  transition: width 1s ease;
`;

const Challenge1 = ({ onComplete }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [engagement, setEngagement] = useState(20);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const choices = [
    {
      id: 'basic',
      text: 'Create an exercise on Present Perfect',
      correct: false,
      feedback: 'Too generic. No context for the student.'
    },
    {
      id: 'better',
      text: 'Make an interesting Present Perfect task for a teenager',
      correct: false,
      feedback: 'Better, but still not specific enough.'
    },
    {
      id: 'perfect',
      text: 'Create an interactive Present Perfect challenge for a 14-year-old B1 student. Format: detective story where they investigate "Who has stolen the Wi-Fi password?" using Present Perfect for clues. Include: 5 suspects, evidence timeline, final reveal. Make it gen-Z relatable.',
      correct: true,
      feedback: 'Excellent! You understand the power of context. Moving forward.'
    }
  ];

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
    
    if (choice.correct) {
      setEngagement(100);
      setChallengeCompleted(true);
      
      // Play success sound
      if (window.playSound) {
        window.playSound('achievement');
      }
      
      // Auto-advance after showing feedback
      setTimeout(() => {
        onComplete(true);
      }, 3000);
    } else {
      setEngagement(10);
      
      // Play error sound
      if (window.playSound) {
        window.playSound('glitch');
      }
      
      // Reset after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedChoice(null);
        setEngagement(20);
      }, 2000);
    }
  };

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <DojoEnvironment />

      <ChallengeTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        PROMPT-FU
      </ChallengeTitle>

      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '30px' }}>
        <HolographicStudent
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <StudentAvatar>😴</StudentAvatar>
          <StudentData>
            STUDENT:<br />
            Age: 14<br />
            Level: B1<br />
            State: BORED.exe<br />
            Topic: Present Perfect
          </StudentData>
          
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '0.7rem', color: '#ffff00' }}>ENGAGEMENT:</div>
            <EngagementMeter>
              <EngagementFill
                initial={{ width: '20%' }}
                animate={{ width: `${engagement}%` }}
              />
            </EngagementMeter>
          </div>
        </HolographicStudent>
      </div>

      <InstructionBox
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <InstructionText>
          First skill - the art of prompting.<br />
          It's like martial arts. Requires precision, understanding, practice.
          <br /><br />
          <strong>Situation:</strong> Student yawning over textbook<br />
          <strong>Task:</strong> Choose the right prompt strike!
        </InstructionText>
      </InstructionBox>

      <AnimatePresence>
        {!showFeedback && (
          <ChoiceContainer>
            {choices.map((choice, index) => (
              <PromptChoice
                key={choice.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </PromptChoice>
            ))}
          </ChoiceContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && selectedChoice && (
          <FeedbackBox
            correct={selectedChoice.correct}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {selectedChoice.feedback}
          </FeedbackBox>
        )}
      </AnimatePresence>

      {/* Hidden white rabbit easter egg */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          opacity: 0.1,
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_challenge1');
          }
        }}
      >
        🐰
      </div>
    </SceneContainer>
  );
};

export default Challenge1;
