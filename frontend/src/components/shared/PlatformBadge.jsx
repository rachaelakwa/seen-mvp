import React from 'react';
import PLATFORM_ICONS from '../../utils/platformIcons';
import './shared.css';

export default function PlatformBadge({ platform }) {
  const platformData = PLATFORM_ICONS[platform];
  
  if (!platformData) {
    return <span>{platform}</span>;
  }

  return (
    <div className="platform-badge">
      <span className="platform-badge-emoji">{platformData.emoji}</span>
      {platform}
    </div>
  );
}
