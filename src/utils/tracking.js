/**
 * Система отслеживания пользователей без регистрации
 * Использует LocalStorage + Browser Fingerprinting
 */

// Генерация browser fingerprint
export const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Matrix Quest', 2, 15);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') || '',
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: navigator.deviceMemory || 0,
    canvas: canvas.toDataURL(),
    webgl: getWebGLFingerprint()
  };
  
  // Создаем хеш из fingerprint
  const fingerprintString = JSON.stringify(fingerprint);
  return hashCode(fingerprintString);
};

// WebGL fingerprint для дополнительной уникальности
const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'no-webgl';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';
    
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  } catch (e) {
    return 'error';
  }
};

// Простой хеш функция
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Генерация уникального user ID
export const generateUserId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `user_${timestamp}_${random}`;
};

// Получить или создать user ID
export const getUserId = () => {
  let userId = localStorage.getItem('matrix_user_id');
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('matrix_user_id', userId);
    localStorage.setItem('matrix_first_visit', new Date().toISOString());
  }
  
  return userId;
};

// Получить fingerprint (кешируем в sessionStorage)
export const getFingerprint = () => {
  let fingerprint = sessionStorage.getItem('matrix_fingerprint');
  
  if (!fingerprint) {
    fingerprint = generateFingerprint();
    sessionStorage.setItem('matrix_fingerprint', fingerprint);
  }
  
  return fingerprint;
};

// Проверка - новый или вернувшийся пользователь
export const isReturningUser = () => {
  return localStorage.getItem('matrix_user_id') !== null;
};

// Получить информацию о сессии
export const getSessionInfo = () => {
  const sessionStart = sessionStorage.getItem('matrix_session_start');
  
  if (!sessionStart) {
    const now = new Date().toISOString();
    sessionStorage.setItem('matrix_session_start', now);
    return {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      startTime: now,
      isNewSession: true
    };
  }
  
  return {
    sessionId: sessionStorage.getItem('matrix_session_id') || 'unknown',
    startTime: sessionStart,
    isNewSession: false
  };
};

// Получить информацию об устройстве
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);
  const isDesktop = !isMobile && !isTablet;
  
  let browser = 'Unknown';
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'MacOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';
  
  return {
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
    browser,
    os,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language
  };
};

// Отследить событие
export const trackEvent = async (eventType, eventData = {}) => {
  const userId = getUserId();
  const fingerprint = getFingerprint();
  const sessionInfo = getSessionInfo();
  const deviceInfo = getDeviceInfo();
  
  const payload = {
    user_id: userId,
    fingerprint: fingerprint,
    session_id: sessionInfo.sessionId,
    event_type: eventType,
    event_data: {
      ...eventData,
      ...deviceInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct'
    },
    is_returning_user: isReturningUser()
  };
  
  try {
    const response = await fetch('http://localhost:8000/api/v1/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.warn('Analytics tracking failed:', response.status);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
};

// Отследить просмотр страницы
export const trackPageView = (pageName) => {
  trackEvent('page_view', { page: pageName });
};

// Отследить начало квеста
export const trackQuestStart = () => {
  trackEvent('quest_start', {
    first_visit: localStorage.getItem('matrix_first_visit')
  });
};

// Отследить завершение квеста
export const trackQuestComplete = (completionTime) => {
  trackEvent('quest_complete', {
    completion_time: completionTime,
    completed_at: new Date().toISOString()
  });
};

// Отследить выбор в сцене
export const trackChoice = (sceneId, choiceId) => {
  trackEvent('choice_made', {
    scene_id: sceneId,
    choice_id: choiceId
  });
};

// Отследить время на сцене
export const trackSceneTime = (sceneId, timeSpent) => {
  trackEvent('scene_time', {
    scene_id: sceneId,
    time_spent: timeSpent
  });
};

// Получить статистику пользователя
export const getUserStats = () => {
  return {
    userId: getUserId(),
    fingerprint: getFingerprint(),
    firstVisit: localStorage.getItem('matrix_first_visit'),
    isReturning: isReturningUser(),
    deviceInfo: getDeviceInfo()
  };
};
