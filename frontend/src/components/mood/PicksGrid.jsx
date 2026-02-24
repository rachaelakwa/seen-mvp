import React from 'react';
import PickCard from './PickCard';
import './mood.css';

export default function PicksGrid({ picks, onSave, savedIds }) {
  return (
    <div className="picks-grid-wrapper">
      <div className="picks-grid">
        {picks.map(pick => (
          <PickCard
            key={pick.id}
            pick={pick}
            onSave={onSave}
            isSaved={savedIds?.has(pick.id)}
          />
        ))}
      </div>
    </div>
  );
}
