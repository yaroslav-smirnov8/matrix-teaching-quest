import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const agentGlitch = keyframes`
  0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
  25% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
  50% { transform: translate(2px, -2px); filter: hue-rotate(180deg); }
  75% { transform: translate(-2px, -2px); filter: hue-rotate(270deg); }
`;

const matrixFight = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const SceneContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(-45deg, #000, #001100, #000, #110000);
  background-size: 400% 400%;
  animation: ${matrixFight} 3s ease infinite;
  padding: 20px;
  position: relative;
  overflow: hidden;
  z-index: 0;
`;

const ChallengeTitle = styled(motion.h2)`
  font-family: 'Courier New', monospace;
  color: #ff0000;
  font-size: 2rem;
  text-align: center;
  text-shadow: 0 0 20px #ff0000;
  margin-bottom: 20px;
`;

const WarningBox = styled(motion.div)`
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid #ff0000;
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const WarningText = styled.div`
  font-family: 'Courier New', monospace;
  color: #ff0000;
  font-size: 1.1rem;
  line-height: 1.6;
  text-shadow: 0 0 5px #ff0000;
`;

const AgentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 30px 0;
  width: 100%;
  max-width: 900px;
`;

const Agent = styled(motion.div)`
  background: rgba(0, 0, 0, 0.8);
  border: 3px solid #333;
  border-radius: 10px;
  padding: 25px;
  position: relative;
  animation: ${agentGlitch} 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #333, #666, #333);
    border-radius: 10px;
    z-index: -1;
  }
`;

const AgentAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 15px;
  border: 2px solid #666;
`;

const AgentMessage = styled.div`
  font-family: 'Courier New', monospace;
  color: #ccc;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 20px;
  font-style: italic;
`;

const ResponseContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResponseButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 12px 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 5px;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    transform: translateX(5px);
  }
  
  &.selected {
    background: rgba(0, 255, 0, 0.2);
    border-color: #00ff00;
  }
  
  &.defeated {
    opacity: 0.5;
    border-color: #666;
    color: #666;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const ProgressDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.completed ? '#00ff00' : '#333'};
  border: 2px solid ${props => props.active ? '#00ff00' : '#666'};
  box-shadow: ${props => props.completed ? '0 0 10px #00ff00' : 'none'};
`;

const VictoryMessage = styled(motion.div)`
  background: rgba(0, 255, 0, 0.1);
  border: 3px solid #00ff00;
  padding: 30px;
  margin: 30px 0;
  border-radius: 15px;
  text-align: center;
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.3rem;
  text-shadow: 0 0 10px #00ff00;
`;

const Challenge2 = ({ onComplete }) => {
  const [currentAgent, setCurrentAgent] = useState(0);
  const [defeatedAgents, setDefeatedAgents] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showVictory, setShowVictory] = useState(false);

  const agents = [
    {
      id: 'agent1',
      avatar: '🕴️',
      message: 'AI is a fraud! A real teacher does everything themselves!',
      responses: [
        { text: 'AI is a tool, like a calculator for a mathematician', correct: true },
        { text: 'I remain the creative director, AI is my assistant', correct: true },
        { text: 'More time for students, less for routine', correct: true }
      ]
    },
    {
      id: 'agent2',
      avatar: '👔',
      message: 'Parents won\'t understand! They want traditional methods!',
      responses: [
        { text: 'Results speak for themselves - students progress faster', correct: true },
        { text: 'AI helps personalize learning for each child', correct: true },
        { text: 'Modern children deserve modern methods', correct: true }
      ]
    },
    {
      id: 'agent3',
      avatar: '🤵',
      message: 'What if AI replaces teachers?',
      responses: [
        { text: 'AI cannot replace human empathy and motivation', correct: true },
        { text: 'Teacher becomes a mentor, not an information transmitter', correct: true },
        { text: 'AI empowers the teacher, doesn\'t replace them', correct: true }
      ]
    }
  ];

  const handleResponse = (response) => {
    setSelectedResponse(response);
    
    if (response.correct) {
      // Defeat current agent
      const newDefeated = [...defeatedAgents, currentAgent];
      setDefeatedAgents(newDefeated);
      
      // Play success sound
      if (window.playSound) {
        window.playSound('achievement');
      }
      
      setTimeout(() => {
        if (currentAgent < agents.length - 1) {
          // Move to next agent
          setCurrentAgent(currentAgent + 1);
          setSelectedResponse(null);
        } else {
          // All agents defeated
          setShowVictory(true);
          setTimeout(() => {
            onComplete(true);
          }, 3000);
        }
      }, 1500);
    } else {
      // Play error sound
      if (window.playSound) {
        window.playSound('glitch');
      }
      
      // Reset after showing feedback
      setTimeout(() => {
        setSelectedResponse(null);
      }, 1500);
    }
  };

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <ChallengeTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        BATTLE WITH AGENTS
      </ChallengeTitle>

      <WarningBox
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <WarningText>
          ⚠️ CAREFUL! AGENTS OF THE OLD SYSTEM ⚠️<br />
          They will try to convince you to return
        </WarningText>
      </WarningBox>

      <ProgressIndicator>
        {agents.map((_, index) => (
          <ProgressDot
            key={index}
            completed={defeatedAgents.includes(index)}
            active={index === currentAgent}
          />
        ))}
      </ProgressIndicator>

      <AnimatePresence mode="wait">
        {!showVictory && (
          <AgentContainer>
            <Agent
              key={`agent-${currentAgent}`}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <AgentAvatar>{agents[currentAgent].avatar}</AgentAvatar>
              <AgentMessage>"{agents[currentAgent].message}"</AgentMessage>
              
              <ResponseContainer>
                {agents[currentAgent].responses.map((response, index) => (
                  <ResponseButton
                    key={index}
                    className={selectedResponse === response ? 'selected' : ''}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResponse(response)}
                    disabled={selectedResponse !== null}
                  >
                    {response.text}
                  </ResponseButton>
                ))}
              </ResponseContainer>
            </Agent>
          </AgentContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVictory && (
          <VictoryMessage
            initial={{ scale: 0, rotateY: 90 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            🎉 AGENTS DEFEATED! 🎉<br />
            <div style={{ fontSize: '1rem', marginTop: '15px' }}>
              You successfully repelled the attacks of the Old System Agents!<br />
              Ready for the final challenge?
            </div>
          </VictoryMessage>
        )}
      </AnimatePresence>

      {/* Hidden white rabbit easter egg */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          opacity: 0.1,
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_challenge2');
          }
        }}
      >
        🐰
      </div>
    </SceneContainer>
  );
};

export default Challenge2;
