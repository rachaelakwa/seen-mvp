import React, { useState } from 'react';
import CirclesPageV1 from './CirclesPageV1';
import CirclesPageV2 from './CirclesPageV2';
import TutorialPointer from '../components/TutorialPointer';
import '../components/circles/circles.css';

export default function CirclesPage() {
  const [version, setVersion] = useState('v2');

  const tutorialSteps = [
    {
      title: 'Your Circles',
      description: 'Your friends share recommendations here. See what your circles are watching and get inspired.'
    },
    {
      title: 'Send Recommendations',
      description: 'Share shows and movies you love with your friends. Click the send button to recommend something.'
    },
    {
      title: 'Take Action',
      description: 'Save recommendations you want to watch or pass on ones you don\'t. Building your watchlist has never been easier.'
    }
  ];

  return (
    <>
      <TutorialPointer tutorialId="circles_page_intro" steps={tutorialSteps} />
      {/* Version Toggle */}
      <div className="version-toggle">
        <button
          onClick={() => setVersion('v1')}
          className={`version-toggle-btn ${version === 'v1' ? 'active' : ''}`}
        >
          V1 (Grid)
        </button>
        <button
          onClick={() => setVersion('v2')}
          className={`version-toggle-btn ${version === 'v2' ? 'active' : ''}`}
        >
          V2 (Chat)
        </button>
      </div>

      {/* Render Selected Version */}
      {version === 'v1' ? <CirclesPageV1 /> : <CirclesPageV2 />}
    </>
  );
}
