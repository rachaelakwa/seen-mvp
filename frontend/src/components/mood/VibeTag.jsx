import React from 'react';
import './mood.css';

export default function VibeTag({ vibe }) {
  return (
    <span className="vibe-tag">
      {vibe}
    </span>
  );
}
