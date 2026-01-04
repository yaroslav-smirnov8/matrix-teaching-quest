import { useEffect, useRef, useState } from 'react';

/**
 * AudioManager - Управление фоновой музыкой в квесте
 */
const AudioManager = ({ scene, volume = 0.5 }) => {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Карта сцен и треков
  const sceneMusic = {
    loading: { src: '/audio/matrix_theme.mp3', volume: 0.6, loop: true },
    scene1: { src: '/audio/matrix_theme.mp3', volume: 0.4, loop: true },
    scene2: { src: '/audio/time.mp3', volume: 0.8, loop: false }, // Выбор таблетки
    scene3a: { src: '/audio/chateau.mp3', volume: 0.65, loop: true },
    challenge1: { src: '/audio/chateau.mp3', volume: 0.7, loop: true },
    challenge2: { src: '/audio/chateau.mp3', volume: 0.7, loop: true },
    finalChoice: { src: '/audio/time.mp3', volume: 0.8, loop: false },
    epilogue: { src: '/audio/time.mp3', volume: 0.85, loop: false }, // Финал
  };

  useEffect(() => {
    const track = sceneMusic[scene];
    
    if (!track) return;

    // Если трек изменился
    if (currentTrack?.src !== track.src) {
      // Плавное затухание предыдущего трека
      if (audioRef.current && isPlaying) {
        const fadeOut = setInterval(() => {
          if (audioRef.current.volume > 0.05) {
            audioRef.current.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            audioRef.current.pause();
            loadNewTrack(track);
          }
        }, 50);
      } else {
        loadNewTrack(track);
      }
    } else {
      // Только меняем громкость
      if (audioRef.current) {
        audioRef.current.volume = track.volume * volume;
      }
    }
  }, [scene, volume]);

  const loadNewTrack = (track) => {
    if (!audioRef.current) return;

    audioRef.current.src = track.src;
    audioRef.current.volume = 0;
    audioRef.current.loop = track.loop;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setCurrentTrack(track);
        
        // Плавное появление
        const fadeIn = setInterval(() => {
          if (audioRef.current.volume < track.volume * volume - 0.05) {
            audioRef.current.volume += 0.05;
          } else {
            audioRef.current.volume = track.volume * volume;
            clearInterval(fadeIn);
          }
        }, 50);
      })
      .catch(error => {
        console.log('Audio autoplay blocked:', error);
        setIsPlaying(false);
      });
  };

  // Обработка клика для разблокировки autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying && currentTrack) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
    };

    document.addEventListener('click', handleUserInteraction, { once: true });
    return () => document.removeEventListener('click', handleUserInteraction);
  }, [isPlaying, currentTrack]);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default AudioManager;
