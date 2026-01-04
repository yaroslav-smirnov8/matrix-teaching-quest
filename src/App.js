import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { QuestProvider } from './contexts/QuestContext';
import AdminApp from './AdminApp';
import { trackPageView, trackQuestStart, trackChoice, getUserId } from './utils/tracking';
import MatrixBackground from './components/effects/MatrixBackground';
import AudioManager from './components/audio/AudioManager';
import VideoTransition from './components/video/VideoTransition';
import LoadingScene from './components/scenes/LoadingScene';
import Scene1 from './components/scenes/Scene1';
import Scene2 from './components/scenes/Scene2';
import Scene3A from './components/scenes/Scene3A';
import Challenge1 from './components/scenes/Challenge1';
import Challenge2 from './components/scenes/Challenge2';
import FinalChoice from './components/scenes/FinalChoice';
import Epilogue from './components/scenes/Epilogue';
import AchievementNotification from './components/ui/AchievementNotification';
import SoundManager from './components/effects/SoundManager';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier New', monospace;
    background: #000;
    color: #00ff00;
    overflow-x: hidden;
    user-select: none;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #000;
  }

  ::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
  }
`;

const theme = {
  colors: {
    primary: '#00ff00',
    secondary: '#00cc00',
    danger: '#ff0000',
    warning: '#ffff00',
    background: '#000000',
    surface: '#001100',
    text: '#00ff00',
    textSecondary: '#008800',
    glitch: '#ff00ff'
  },
  fonts: {
    mono: "'Courier New', monospace",
    matrix: "'Share Tech Mono', monospace"
  },
  effects: {
    glow: '0 0 10px currentColor',
    textShadow: '0 0 5px currentColor',
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)'
  }
};

const AppContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
`;

const SceneContainer = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Custom hook to get current location for animations
function useLocationForAnimation() {
  const location = useLocation();
  return location;
}

function App() {
  const location = useLocationForAnimation();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes location={location}>
        <Route path="/" element={
          <QuestProvider>
            <QuestAppContent />
          </QuestProvider>
        } />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </ThemeProvider>
  );
}

function QuestAppContent() {
  const [currentScene, setCurrentScene] = useState('loading');
  const [sceneData, setSceneData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionVideo, setTransitionVideo] = useState(null);

  useEffect(() => {
    // Track quest start
    trackQuestStart();
    console.log('User ID:', getUserId());
  }, []);

  // Show video transition
  const playTransition = (videoSrc, callback) => {
    setTransitionVideo(videoSrc);
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      if (callback) callback();
    }, 3000);
  };

  const renderScene = () => {
    console.log('App: Rendering scene:', currentScene);

    switch (currentScene) {
      case 'loading':
        return <LoadingScene onComplete={() => {
          console.log('App: LoadingScene completed, moving to scene1');
          setCurrentScene('scene1');
        }} />;
      case 'scene1':
        return <Scene1 onChoice={(choice) => {
          console.log('App: Scene1 choice:', choice);
          handleSceneChoice('scene1', choice);
        }} />;
      case 'scene1_2':
        return <Scene1 variant="loop" onComplete={() => setCurrentScene('scene1')} />;
      case 'scene2':
        return <Scene2 onChoice={(choice) => handleSceneChoice('scene2', choice)} />;
      case 'scene3a':
        return <Scene3A onComplete={() => setCurrentScene('challenge1')} />;
      case 'challenge1':
        return <Challenge1 onComplete={(success) => handleChallengeComplete('challenge1', success)} />;
      case 'challenge2':
        return <Challenge2 onComplete={(success) => handleChallengeComplete('challenge2', success)} />;
      case 'final_choice':
        return <FinalChoice onChoice={(choice) => handleFinalChoice(choice)} />;
      case 'epilogue':
        return <Epilogue />;
      default:
        console.log('App: Unknown scene, defaulting to loading');
        return <LoadingScene onComplete={() => setCurrentScene('scene1')} />;
    }
  };

  const handleSceneChoice = async (sceneId, choiceId) => {
    // Track choice
    trackChoice(sceneId, choiceId);

    // Show video transition for key moments
    if (sceneId === 'scene2' && (choiceId === 'blue_pill' || choiceId === 'red_pill')) {
      // After pill choice - show glitch
      playTransition('/videos/glitch_awakening.mp4', () => {
        proceedToNextScene(sceneId, choiceId);
      });
      return;
    }

    // Normal transition
    proceedToNextScene(sceneId, choiceId);
  };

  const proceedToNextScene = async (sceneId, choiceId) => {
    try {
      // Send choice to backend
      const response = await fetch('http://localhost:8000/api/v1/quest/choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: getUserId(),
          scene_id: sceneId,
          choice_id: choiceId,
          choice_text: 'User choice'
        })
      });

      const data = await response.json();

      // Handle achievements
      if (data.achievements_earned?.length > 0) {
        setAchievements(prev => [...prev, ...data.achievements_earned]);
      }

      // Navigate to next scene
      setCurrentScene(data.next_scene_id);
      setSceneData(data.scene_content);

    } catch (error) {
      console.error('Error making choice:', error);
      // Fallback navigation for localhost development without backend
      console.log('Using fallback navigation - backend not available');

      if (sceneId === 'scene1') {
        setCurrentScene('scene2');
      } else if (sceneId === 'scene2') {
        setCurrentScene('scene3a');
      }

      // Simulate some achievements for demo
      if (Math.random() > 0.7) {
        setAchievements(prev => [...prev, 'Demo Achievement Unlocked!']);
      }
    }
  };

  const handleChallengeComplete = (challengeId, success) => {
    if (success) {
      if (challengeId === 'challenge1') {
        setCurrentScene('challenge2');
      } else if (challengeId === 'challenge2') {
        setCurrentScene('final_choice');
      }
    }
  };

  const handleFinalChoice = async (portalChoice) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/quest/choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: getUserId(),
          scene_id: 'final_choice',
          choice_id: portalChoice,
          choice_text: 'Portal choice'
        })
      });

      const data = await response.json();

      // Store promo code for epilogue
      if (data.promo_code) {
        localStorage.setItem('matrix_promo_code', data.promo_code);
      }

      setCurrentScene('epilogue');

    } catch (error) {
      console.error('Error making final choice:', error);
      // Fallback for localhost - generate demo promo code
      localStorage.setItem('matrix_promo_code', 'MATRIX40DEMO');
      setCurrentScene('epilogue');
    }
  };

  return (
    <AppContainer>
      <MatrixBackground />
      <AudioManager scene={currentScene} volume={0.7} />
      <SoundManager />

      {/* Video transition */}
      {showTransition && transitionVideo && (
        <VideoTransition
          src={transitionVideo}
          onComplete={() => setShowTransition(false)}
        />
      )}

        <AnimatePresence mode="wait">
          <SceneContainer key={currentScene}>
            {renderScene()}
          </SceneContainer>
        </AnimatePresence>

        {achievements.map((achievement, index) => (
          <AchievementNotification
            key={`${achievement}-${index}`}
            achievement={achievement}
            onComplete={() => {
              setAchievements(prev => prev.filter((_, i) => i !== index));
            }}
          />
        ))}
      </AppContainer>
  );
}

export default App;
