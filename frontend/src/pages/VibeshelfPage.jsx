import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import PatternBanner from '../components/vibeshelf/PatternBanner';
import ShelfList from '../components/vibeshelf/ShelfList';
import AddReflectionModal from '../components/vibeshelf/AddReflectionModal';
import TutorialPointer from '../components/TutorialPointer';
import { savesService } from '../services/saves.js';
import { PICKS } from '../data/picks';
import '../components/vibeshelf/vibeshelf.css';

function resolveTitle(titleId) {
  return PICKS.find(p => p.id === titleId);
}

export default function VibeshelfPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shelfItems, setShelfItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSaves = useCallback(async () => {
    try {
      const { saves } = await savesService.getSaves();
      const items = saves.map(save => {
        const title = resolveTitle(save.titleId);
        return {
          id: save._id,
          titleId: save.titleId,
          title: title?.title || save.titleId,
          image: title?.imageUrl || '',
          platform: title?.platform || '',
          mood: save.moodId || '',
          note: title?.vibeTag || '',
          savedAt: save.savedAt,
        };
      });
      setShelfItems(items);
    } catch (err) {
      console.error('Failed to load saves:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadSaves(); }, [loadSaves]);

  const handleRemove = useCallback(async (saveId) => {
    try {
      await savesService.deleteSave(saveId);
      setShelfItems(prev => prev.filter(item => item.id !== saveId));
    } catch (err) {
      console.error('Failed to remove:', err);
    }
  }, []);

  const handleAddReflection = (reflection) => {
    setShelfItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: reflection.title,
        mood: reflection.mood,
        note: reflection.note,
        emotions: reflection.emotions,
        image: '',
        isPrivate: false,
      }
    ]);
    setIsModalOpen(false);
  };

  const tutorialSteps = [
    {
      title: 'Your Vibeshelf',
      description: 'A personal library where you capture the shows, movies, and moments that resonate with you.'
    },
    {
      title: 'Reflection & Vibes',
      description: 'Add your thoughts and emotions to each item. Reflect on what you\'re watching and why it matters to you.'
    }
  ];

  return (
    <PageContainer>
      <TutorialPointer tutorialId="vibeshelf_page_intro" steps={tutorialSteps} />
      <div className="vibeshelf-page-content">
        <SectionTitle>Your Vibeshelf</SectionTitle>
        <PatternBanner />
        
        <div className="vibeshelf-page-add-section">
          <button
            onClick={() => setIsModalOpen(true)}
            className="vibeshelf-page-add-btn"
          >
            + Add to shelf
          </button>
        </div>

        {isLoading ? (
          <p>Loading your shelf...</p>
        ) : (
          <ShelfList items={shelfItems} onRemove={handleRemove} />
        )}
        
        <AddReflectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddReflection}
        />
      </div>
    </PageContainer>
  );
}
