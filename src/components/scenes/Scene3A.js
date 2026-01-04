import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const digitalExplosion = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 1; }
  50% { transform: scale(2) rotate(180deg); opacity: 0.5; }
  100% { transform: scale(4) rotate(360deg); opacity: 0; }
`;

const whiteRoomGlow = keyframes`
  0%, 100% { background: linear-gradient(45deg, #fff 0%, #f0f0f0 100%); }
  50% { background: linear-gradient(45deg, #f0f0f0 0%, #fff 100%); }
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
`;

const ExplosionEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 3px solid #00ff00;
  border-radius: 50%;
  animation: ${digitalExplosion} 2s ease-out;
  z-index: 5;
`;

const WhiteRoom = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: ${whiteRoomGlow} 4s ease-in-out infinite;
  z-index: -1;
  opacity: 0;
  pointer-events: none;
`;

const AIAvatar = styled(motion.div)`
  width: 200px;
  height: 200px;
  border: 3px solid #000;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-bottom: 30px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
`;

const DialogueBox = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #000;
  padding: 30px;
  margin: 20px 0;
  border-radius: 10px;
  max-width: 800px;
  text-align: center;
  backdrop-filter: blur(10px);
  z-index: 10;
  position: relative;
`;

const DialogueText = styled.div`
  font-family: 'Courier New', monospace;
  color: #000;
  font-size: 1.1rem;
  line-height: 1.6;
  text-shadow: none;
  margin-bottom: 20px;
`;

const Scene3A = ({ onComplete }) => {
  useEffect(() => {
    // Auto-advance to challenge after 6 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Digital explosion effect */}
      <ExplosionEffect />

      {/* White room background that fades in */}
      <WhiteRoom
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 2, duration: 1 }}
      />

      <AIAvatar
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ delay: 2.5, duration: 2, type: "spring" }}
      >
        🤖
      </AIAvatar>

      <DialogueBox
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        <DialogueText>
          <strong>Welcome to reality.</strong>
          <br /><br />
          What you saw before was a program. The Matrix of Traditional Teaching.
          <br /><br />
          It feeds on your energy, time, passion for teaching.
          <br />
          But there's another way. The Digital Teacher's Path.
          <br /><br />
          <strong>Ready for training?</strong>
        </DialogueText>
      </DialogueBox>

      {/* Hidden white rabbit easter egg */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          opacity: 0.1,
          fontSize: '16px',
          cursor: 'pointer',
          zIndex: 15
        }}
        onClick={() => {
          if (window.triggerEasterEgg) {
            window.triggerEasterEgg('white_rabbit_4');
          }
        }}
      >
        🐰
      </div>
    </SceneContainer>
  );
};

export default Scene3A;
