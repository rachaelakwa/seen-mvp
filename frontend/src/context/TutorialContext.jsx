import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [viewedTutorials, setViewedTutorials] = useState({});
  const [tutorialsEnabled, setTutorialsEnabled] = useState(false);

  const storageKey = user?._id || user?.id || user?.email;
  const tutorialsEnabledKey = storageKey ? `tutorials_enabled_${storageKey}` : null;

  useEffect(() => {
    // Wait until auth has resolved before touching tutorial state
    if (isLoading) return;

    if (!storageKey) {
      setViewedTutorials({});
      setTutorialsEnabled(false);
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

    // Only users created through signup should have tutorials auto-enabled.
    setTutorialsEnabled(localStorage.getItem(tutorialsEnabledKey) === 'true');
  }, [storageKey, isLoading, tutorialsEnabledKey]);

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
    if (!tutorialsEnabled) return true;
    return viewedTutorials[tutorialId] === true;
  }, [viewedTutorials, tutorialsEnabled]);

  const resetTutorial = useCallback((tutorialId) => {
    setViewedTutorials(prev => {
      const updated = { ...prev };
      delete updated[tutorialId];
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!storageKey || !tutorialsEnabledKey) return;

    const requiredTutorials = [
      'mood_page_intro',
      'circles_page_intro',
      'vibeshelf_page_intro',
      'profile_page_intro',
    ];

    const hasCompletedAll = requiredTutorials.every((tutorialId) => viewedTutorials[tutorialId] === true);
    if (hasCompletedAll && tutorialsEnabled) {
      localStorage.setItem(tutorialsEnabledKey, 'false');
      setTutorialsEnabled(false);
    }
  }, [viewedTutorials, tutorialsEnabled, storageKey, tutorialsEnabledKey]);

  return (
    <TutorialContext.Provider value={{ viewedTutorials, markTutorialAsViewed, isTutorialViewed, resetTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};
