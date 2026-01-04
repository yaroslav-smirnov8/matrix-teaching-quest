import React, { createContext, useContext, useReducer, useEffect } from 'react';

const QuestContext = createContext();

export const useQuest = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};

const initialState = {
  currentScene: 'loading',
  userProgress: {
    questCompleted: false,
    completionTime: null,
    choices: {},
    achievements: [],
    whiteRabbitsFound: 0,
    easterEggsFound: [],
    promoCode: null
  },
  gameStats: {
    startTime: null,
    totalPlaytime: 0,
    perfectRun: true,
    speedRun: false
  },
  ui: {
    showAchievements: false,
    soundEnabled: true,
    effectsEnabled: true
  }
};

const questReducer = (state, action) => {
  switch (action.type) {
    case 'START_QUEST':
      return {
        ...state,
        gameStats: {
          ...state.gameStats,
          startTime: Date.now()
        }
      };

    case 'MAKE_CHOICE':
      const newChoices = {
        ...state.userProgress.choices,
        [action.payload.sceneId]: action.payload.choiceId
      };
      
      // Check if it's a wrong choice for perfect run
      const wrongChoices = ['close_message', 'blue_pill'];
      const isPerfectRun = state.gameStats.perfectRun && 
        !wrongChoices.includes(action.payload.choiceId);

      return {
        ...state,
        currentScene: action.payload.nextScene,
        userProgress: {
          ...state.userProgress,
          choices: newChoices
        },
        gameStats: {
          ...state.gameStats,
          perfectRun: isPerfectRun
        }
      };

    case 'COMPLETE_QUEST':
      const completionTime = state.gameStats.startTime ? 
        Date.now() - state.gameStats.startTime : 0;
      const isSpeedRun = completionTime < 300000; // 5 minutes

      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          questCompleted: true,
          completionTime: completionTime,
          promoCode: action.payload.promoCode
        },
        gameStats: {
          ...state.gameStats,
          speedRun: isSpeedRun
        }
      };

    case 'ADD_ACHIEVEMENT':
      if (state.userProgress.achievements.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          achievements: [...state.userProgress.achievements, action.payload]
        }
      };

    case 'FIND_WHITE_RABBIT':
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          whiteRabbitsFound: state.userProgress.whiteRabbitsFound + 1
        }
      };

    case 'TRIGGER_EASTER_EGG':
      if (state.userProgress.easterEggsFound.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        userProgress: {
          ...state.userProgress,
          easterEggsFound: [...state.userProgress.easterEggsFound, action.payload]
        }
      };

    case 'UPDATE_SCENE':
      return {
        ...state,
        currentScene: action.payload
      };

    case 'TOGGLE_SOUND':
      return {
        ...state,
        ui: {
          ...state.ui,
          soundEnabled: !state.ui.soundEnabled
        }
      };

    case 'TOGGLE_EFFECTS':
      return {
        ...state,
        ui: {
          ...state.ui,
          effectsEnabled: !state.ui.effectsEnabled
        }
      };

    case 'LOAD_PROGRESS':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export const QuestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(questReducer, initialState);

  // Create a simple user object for web version
  const getUser = () => {
    return {
      id: 'web_user_' + Date.now().toString(),
      first_name: 'Web',
      last_name: 'User',
      username: 'web_user',
      language_code: 'en'
    };
  };

  // Simulate haptic feedback for web (no actual haptic on web)
  const hapticFeedback = (type = 'impact') => {
    // On web, we can play a sound or do a visual effect instead
    // For now, just log for demo purposes
    console.log(`Haptic feedback: ${type}`);
  };

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('matrix_quest_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        dispatch({ type: 'LOAD_PROGRESS', payload: progress });
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  // Save progress whenever state changes
  useEffect(() => {
    localStorage.setItem('matrix_quest_progress', JSON.stringify(state));
  }, [state]);

  // Global easter egg handler
  useEffect(() => {
    window.triggerEasterEgg = (easterEggId) => {
      hapticFeedback('light');

      if (easterEggId.startsWith('white_rabbit')) {
        dispatch({ type: 'FIND_WHITE_RABBIT' });

        // Check for Trinity achievement (all white rabbits found)
        if (state.userProgress.whiteRabbitsFound >= 4) {
          dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'white_rabbit_collector' });
        }
      }

      dispatch({ type: 'TRIGGER_EASTER_EGG', payload: easterEggId });

      // Check for specific easter egg achievements
      if (easterEggId === 'black_cat_double_click') {
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'deja_vu' });
      } else if (easterEggId === 'there_is_no_spoon') {
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'spoon_bender' });
      } else if (easterEggId === 'secret_code_2319') {
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'code_breaker' });
      }
    };

    return () => {
      delete window.triggerEasterEgg;
    };
  }, [state.userProgress.whiteRabbitsFound]);

  const startQuest = async () => {
    dispatch({ type: 'START_QUEST' });

    try {
      // Try to call backend API
      const user = getUser();
      const response = await fetch('/api/v1/quest/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: user.id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          language_code: user.language_code
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to start quest:', error);
      // Return mock data for web version when backend is not available
      return {
        status: 'success',
        message: 'Quest started in web mode',
        next_scene: 'scene1'
      };
    }
  };

  const makeChoice = async (sceneId, choiceId, choiceText) => {
    hapticFeedback('medium');

    try {
      const user = getUser();
      const response = await fetch('/api/v1/quest/choice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegram_id: user.id,
          scene_id: sceneId,
          choice_id: choiceId,
          choice_text: choiceText
        })
      });

      const data = await response.json();

      // Update local state
      dispatch({
        type: 'MAKE_CHOICE',
        payload: {
          sceneId,
          choiceId,
          nextScene: data.next_scene_id
        }
      });

      // Handle achievements
      if (data.achievements_earned?.length > 0) {
        data.achievements_earned.forEach(achievement => {
          dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
        });
        hapticFeedback('success');
      }

      // Handle quest completion
      if (data.promo_code) {
        dispatch({
          type: 'COMPLETE_QUEST',
          payload: { promoCode: data.promo_code }
        });
        hapticFeedback('success');
      }

      return data;
    } catch (error) {
      console.error('Failed to make choice:', error);
      // Handle choice locally when backend is not available
      const mockNextSceneMap = {
        'loading': 'scene1',
        'scene1': 'scene2',
        'scene2': 'scene3a',
        'scene3a': 'challenge1',
        'challenge1': 'challenge2',
        'challenge2': 'final_choice',
        'final_choice': 'epilogue'
      };

      const nextScene = mockNextSceneMap[sceneId] || 'epilogue';

      // Update local state
      dispatch({
        type: 'MAKE_CHOICE',
        payload: {
          sceneId,
          choiceId,
          nextScene
        }
      });

      // Random achievement for demo
      if (Math.random() > 0.7) {
        const demoAchievements = ['Curious Explorer', 'Path Finder', 'Matrix Viewer'];
        const randomAchievement = demoAchievements[Math.floor(Math.random() * demoAchievements.length)];
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: randomAchievement });
        hapticFeedback('success');
      }

      // Mock completion after final choice
      if (sceneId === 'final_choice') {
        dispatch({
          type: 'COMPLETE_QUEST',
          payload: { promoCode: 'WEB_DEMO_2024' }
        });
        hapticFeedback('success');
      }

      return {
        next_scene_id: nextScene,
        achievements_earned: Math.random() > 0.7 ? [randomAchievement || 'Path Finder'] : [],
        promo_code: sceneId === 'final_choice' ? 'WEB_DEMO_2024' : null
      };
    }
  };

  const checkAchievements = () => {
    // Check for speed run achievement
    if (state.userProgress.questCompleted && 
        state.userProgress.completionTime < 300000 && 
        !state.userProgress.achievements.includes('speed_runner')) {
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'speed_runner' });
    }

    // Check for perfect run achievement
    if (state.userProgress.questCompleted && 
        state.gameStats.perfectRun && 
        !state.userProgress.achievements.includes('perfect_code')) {
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'perfect_code' });
    }

    // Check for glitch hunter achievement
    const glitchEggs = state.userProgress.easterEggsFound.filter(egg => 
      egg.startsWith('glitch')
    );
    if (glitchEggs.length >= 5 && 
        !state.userProgress.achievements.includes('glitch_hunter')) {
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: 'glitch_hunter' });
    }
  };

  const getProgress = () => {
    return {
      currentScene: state.currentScene,
      questCompleted: state.userProgress.questCompleted,
      completionTime: state.userProgress.completionTime,
      achievements: state.userProgress.achievements,
      whiteRabbitsFound: state.userProgress.whiteRabbitsFound,
      easterEggsFound: state.userProgress.easterEggsFound,
      promoCode: state.userProgress.promoCode,
      perfectRun: state.gameStats.perfectRun,
      speedRun: state.gameStats.speedRun
    };
  };

  const resetProgress = () => {
    localStorage.removeItem('matrix_quest_progress');
    dispatch({ type: 'LOAD_PROGRESS', payload: initialState });
  };

  const value = {
    state,
    dispatch,
    startQuest,
    makeChoice,
    checkAchievements,
    getProgress,
    resetProgress
  };

  return (
    <QuestContext.Provider value={value}>
      {children}
    </QuestContext.Provider>
  );
};
