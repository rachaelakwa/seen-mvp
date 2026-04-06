import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import Chip from '../components/shared/Chip';
import ChipRow from '../components/shared/ChipRow';
import PicksHeader from '../components/mood/PicksHeader';
import PicksGrid from '../components/mood/PicksGrid';
import TutorialPointer from '../components/TutorialPointer';
import { MOODS } from '../data/moods';
import { PICKS } from '../data/picks';
import { getPicksForMood } from '../utils/recommend';
import { savesService } from '../services/saves.js';
import { moodsService } from '../services/moods.js';
import { titlesService } from '../services/titles.js';

export default function MoodPage() {
  const { user } = useAuth();
  const [selectedMoodId, setSelectedMoodId] = useState('soft');
  const [picksCount, setPicksCount] = useState(3);
  const [savedIds, setSavedIds] = useState(new Set());
  const [apiPicks, setApiPicks] = useState(null);
  const [picksLoading, setPicksLoading] = useState(false);

  const displayName = user?.firstName || user?.username || 'there';

  useEffect(() => {
    let cancelled = false;
    setPicksLoading(true);
    setApiPicks(null);
    titlesService.getByMood(selectedMoodId)
      .then(({ titles }) => {
        if (!cancelled) setApiPicks(titles);
      })
      .catch(() => {
        if (!cancelled) setApiPicks(null); // fall back to PICKS
      })
      .finally(() => {
        if (!cancelled) setPicksLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedMoodId]);

  const sourcePicks = apiPicks && apiPicks.length > 0 ? apiPicks : PICKS;
  const displayedPicks = getPicksForMood({
    moodId: selectedMoodId,
    picks: sourcePicks,
    count: picksCount,
  });

  const handleMoodSelect = useCallback((moodId) => {
    setSelectedMoodId(moodId);
    moodsService.createMoodEvent(moodId, picksCount).catch(console.error);
  }, [picksCount]);

  const handleSave = useCallback(async (titleId) => {
    if (savedIds.has(titleId)) return;
    try {
      await savesService.createSave(titleId, selectedMoodId);
      setSavedIds(prev => new Set(prev).add(titleId));
    } catch (err) {
      if (err.message?.includes('Already saved')) {
        setSavedIds(prev => new Set(prev).add(titleId));
      } else {
        console.error('Save failed:', err);
      }
    }
  }, [savedIds, selectedMoodId]);

  const tutorialSteps = [
    {
      title: 'Your Mood',
      description: 'Select how you\'re feeling right now. Your mood determines what content recommendations you see.'
    },
    {
      title: 'Browse Content',
      description: 'See shows and movies that match your current mood. Each mood has its own curated selection.'
    },
    {
      title: 'Adjust Count',
      description: 'Use this slider to see more or fewer recommendations. Great for when you want quick picks or deeper exploration.'
    }
  ];

  return (
    <PageContainer>
      <TutorialPointer tutorialId="mood_page_intro" steps={tutorialSteps} />
      <SectionTitle>Hi {displayName}, how are you feeling?</SectionTitle>
      <ChipRow>
        {MOODS.map(mood => (
          <Chip
            key={mood.id}
            label={mood.label}
            icon={mood.icon}
            isSelected={selectedMoodId === mood.id}
            onClick={() => handleMoodSelect(mood.id)}
          />
        ))}
      </ChipRow>
      <PicksHeader value={picksCount} onChange={setPicksCount} />
      {picksLoading
        ? <p className="picks-loading">Finding picks for your mood...</p>
        : <PicksGrid picks={displayedPicks} onSave={handleSave} savedIds={savedIds} />
      }
    </PageContainer>
  );
}
