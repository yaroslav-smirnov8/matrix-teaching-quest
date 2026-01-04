import React, { useEffect, useRef } from 'react';
import { useQuest } from '../../contexts/QuestContext';

const SoundManager = () => {
  const { state } = useQuest();
  const audioContext = useRef(null);
  const sounds = useRef({});

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Generate notification ping sound
  const playNotificationPing = () => {
    if (!state.ui.soundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.current.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.3);

    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.3);
  };

  // Generate glitch sound effect
  const playGlitchSound = () => {
    if (!state.ui.soundEnabled || !audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    const filter = audioContext.current.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.current.currentTime);
    
    // Random frequency modulation for glitch effect
    for (let i = 0; i < 10; i++) {
      const time = audioContext.current.currentTime + (i * 0.02);
      const freq = 100 + Math.random() * 300;
      oscillator.frequency.setValueAtTime(freq, time);
    }

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.current.currentTime);

    gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.2);

    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.2);
  };

  // Generate achievement sound
  const playAchievementSound = () => {
    if (!state.ui.soundEnabled || !audioContext.current) return;

    const oscillator1 = audioContext.current.createOscillator();
    const oscillator2 = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator1.frequency.setValueAtTime(523.25, audioContext.current.currentTime); // C5
    oscillator1.frequency.setValueAtTime(659.25, audioContext.current.currentTime + 0.1); // E5
    oscillator1.frequency.setValueAtTime(783.99, audioContext.current.currentTime + 0.2); // G5

    oscillator2.frequency.setValueAtTime(261.63, audioContext.current.currentTime); // C4
    oscillator2.frequency.setValueAtTime(329.63, audioContext.current.currentTime + 0.1); // E4
    oscillator2.frequency.setValueAtTime(392.00, audioContext.current.currentTime + 0.2); // G4

    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + 0.5);

    oscillator1.start(audioContext.current.currentTime);
    oscillator1.stop(audioContext.current.currentTime + 0.5);
    oscillator2.start(audioContext.current.currentTime);
    oscillator2.stop(audioContext.current.currentTime + 0.5);
  };

  // Expose sound functions globally
  useEffect(() => {
    window.playSound = (soundType) => {
      switch (soundType) {
        case 'notification':
          playNotificationPing();
          break;
        case 'glitch':
          playGlitchSound();
          break;
        case 'achievement':
          playAchievementSound();
          break;
        default:
          break;
      }
    };

    return () => {
      delete window.playSound;
    };
  }, [state.ui.soundEnabled]);

  // Auto-play sounds based on scene changes
  useEffect(() => {
    if (state.currentScene === 'loading') {
      setTimeout(() => playNotificationPing(), 4000);
    }
  }, [state.currentScene]);

  // Play achievement sound when new achievements are earned
  useEffect(() => {
    if (state.userProgress.achievements.length > 0) {
      playAchievementSound();
    }
  }, [state.userProgress.achievements.length]);

  return null; // This component doesn't render anything
};

export default SoundManager;
