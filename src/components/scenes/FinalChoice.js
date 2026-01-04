import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const cityGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 0, 0.6); }
`;

const portalPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const SceneContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(180deg, #000 0%, #001a00 50%, #000 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const CityView = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    to top,
    rgba(0, 255, 0, 0.1) 0%,
    transparent 100%
  );
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 50px,
      rgba(0, 255, 0, 0.1) 50px,
      rgba(0, 255, 0, 0.1) 52px
    );
  animation: ${cityGlow} 4s ease-in-out infinite;
  z-index: -1; /* Place behind other content */
  pointer-events: none; /* Don't block clicks */
`;

const NeoYaroslav = styled(motion.div)`
  width: 150px;
  height: 150px;
  border: 3px solid #00ff00;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.2) 0%, transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 30px;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.5);
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    width: 120%;
    height: 120%;
    border: 1px solid #00ff00;
    border-radius: 50%;
    animation: ${portalPulse} 3s linear infinite;
  }
`;

const DialogueBox = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #00ff00;
  padding: 30px;
  margin: 20px 0;
  border-radius: 10px;
  max-width: 900px;
  text-align: center;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
`;

const DialogueText = styled.div`
  font-family: 'Courier New', monospace;
  color: #00ff00;
  font-size: 1.1rem;
  line-height: 1.8;
  text-shadow: 0 0 5px #00ff00;
  margin-bottom: 20px;
`;

const PortalContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const Portal = styled(motion.div)`
  width: 250px;
  height: 300px;
  border: 3px solid;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 2; /* Make sure portal is above background */

  &.the-one {
    border-color: #ff0000;
    background: linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.05));
    box-shadow: 0 0 30px rgba(255, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 0 50px rgba(255, 0, 0, 0.6);
      transform: scale(1.05);
    }
  }

  &.chosen {
    border-color: #0000ff;
    background: linear-gradient(135deg, rgba(0, 0, 255, 0.1), rgba(0, 0, 255, 0.05));
    box-shadow: 0 0 30px rgba(0, 0, 255, 0.3);

    &:hover {
      box-shadow: 0 0 50px rgba(0, 0, 255, 0.6);
      transform: scale(1.05);
    }
  }

  &.awakened {
    border-color: #00ff00;
    background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05));
    box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);

    &:hover {
      box-shadow: 0 0 50px rgba(0, 255, 0, 0.6);
      transform: scale(1.05);
    }
  }
`;

const PortalTitle = styled.h3`
  font-family: 'Courier New', monospace;
  font-size: 1.3rem;
  margin-bottom: 15px;
  text-align: center;
  text-shadow: 0 0 10px currentColor;
`;

const PortalDescription = styled.p`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
  text-align: center;
`;

const PromoCode = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid currentColor;
  padding: 10px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  font-size: 1.1rem;
`;

const Discount = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 0 0 15px currentColor;
`;

const Preview = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  opacity: 0.7;
`;

const FinalChoice = ({ onChoice }) => {
  const [showDialogue, setShowDialogue] = useState(false);
  const [showPortals, setShowPortals] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowDialogue(true), 1000);
    const timer2 = setTimeout(() => setShowPortals(true), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handlePortalChoice = (portalId) => {
    onChoice(portalId);
  };

  const portals = [
    {
      id: 'the_one',
      title: 'THE ONE',
      description: 'Full immersion. 4 weeks intensive. Become a master.',
      promoCode: 'MATRIX40',
      discount: '40%',
      preview: '🎯',
      className: 'the-one',
      color: '#ff0000'
    },
    {
      id: 'chosen',
      title: 'CHOSEN',
      description: 'Support and mentorship. Grow gradually.',
      promoCode: 'MATRIX40',
      discount: '40%',
      preview: '🚀',
      className: 'chosen',
      color: '#0000ff'
    },
    {
      id: 'awakened',
      title: 'AWAKENED',
      description: 'Basic knowledge. Start the journey.',
      promoCode: 'MATRIX40',
      discount: '40%',
      preview: '🌱',
      className: 'awakened',
      color: '#00ff00'
    }
  ];

  return (
    <SceneContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <CityView />

      <NeoYaroslav
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ duration: 2, type: "spring" }}
      >
        🕴️
      </NeoYaroslav>

      <AnimatePresence>
        {showDialogue && (
          <DialogueBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <DialogueText>
              <strong>You've walked the path I walked two years ago.</strong>
              <br /><br />
              See this city? Each building is a teacher stuck in the Matrix.
              <br /><br />
              I was like them. 6 lessons a day, preparation until 2 AM, coffee by the liter.
              <br />
              I thought - this is normal. This is what the profession is.
              <br /><br />
              <span style={{ color: '#ffff00' }}>
                Now I have 23 students instead of 15.<br />
                I work 5 hours instead of 12.<br />
                Students are happy. So am I.
              </span>
              <br /><br />
              <strong>Are you ready to become the architect of your reality?</strong>
            </DialogueText>
          </DialogueBox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPortals && (
          <PortalContainer>
            {portals.map((portal, index) => (
              <Portal
                key={portal.id}
                className={portal.className}
                initial={{ y: 100, opacity: 0, rotateY: 90 }}
                animate={{ y: 0, opacity: 1, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.3, 
                  type: "spring",
                  damping: 10
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePortalChoice(portal.id)}
                style={{ color: portal.color }}
              >
                <Preview>{portal.preview}</Preview>
                <PortalTitle>{portal.title}</PortalTitle>
                <PortalDescription>{portal.description}</PortalDescription>
                <PromoCode>Promo code: {portal.promoCode}</PromoCode>
                <Discount>{portal.discount} discount</Discount>
              </Portal>
            ))}
          </PortalContainer>
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
            window.triggerEasterEgg('white_rabbit_5');
          }
        }}
      >
        🐰
      </div>

      {/* Secret code input area */}
      <input
        type="text"
        placeholder="Enter code..."
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'transparent',
          border: '1px solid #333',
          color: '#00ff00',
          padding: '5px',
          fontSize: '12px',
          width: '100px',
          opacity: 0.1
        }}
        onChange={(e) => {
          if (e.target.value === '2319' && window.triggerEasterEgg) {
            window.triggerEasterEgg('secret_code_2319');
          }
          if (e.target.value.toLowerCase() === 'there is no spoon' && window.triggerEasterEgg) {
            window.triggerEasterEgg('there_is_no_spoon');
          }
        }}
      />
    </SceneContainer>
  );
};

export default FinalChoice;
