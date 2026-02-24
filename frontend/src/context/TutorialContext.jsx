import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const { user } = useAuth();
  const [viewedTutorials, setViewedTutorials] = useState({});

  const storageKey = user?._id || user?.id || user?.email;

  useEffect(() => {
    if (!storageKey) {
      setViewedTutorials({});
      return;
    }

    const saved = localStorage.getItem(`tutorials_${storageKey}`);
    if (saved) {
      try {
        setViewedTutorials(JSON.parse(saved));
      } catch {
        setViewedTutorials({});
      }
    } else {
      setViewedTutorials({});
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(`tutorials_${storageKey}`, JSON.stringify(viewedTutorials));
  }, [viewedTutorials, storageKey]);

  const markTutorialAsViewed = useCallback((tutorialId) => {
    setViewedTutorials(prev => ({
      ...prev,
      [tutorialId]: true
    }));
  }, []);

  const isTutorialViewed = useCallback((tutorialId) => {
    return viewedTutorials[tutorialId] === true;
  }, [viewedTutorials]);

  const resetTutorial = useCallback((tutorialId) => {
    setViewedTutorials(prev => {
      const updated = { ...prev };
      delete updated[tutorialId];
      return updated;
    });
  }, []);

  return (
    <TutorialContext.Provider value={{ viewedTutorials, markTutorialAsViewed, isTutorialViewed, resetTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};
