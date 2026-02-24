import React from 'react';
import Chip from '../shared/Chip';
import ChipRow from '../shared/ChipRow';
import PLATFORM_ICONS from '../../utils/platformIcons';
import './mood.css';

export default function PlatformFilter({ selected, onChange }) {
  const platforms = Object.keys(PLATFORM_ICONS);

  return (
    <div className="platform-filter">
      <h4 className="platform-filter-title">
        Filter by platform
      </h4>
      <ChipRow>
        {platforms.map(platform => {
          const platformData = PLATFORM_ICONS[platform];
          const isSelected = selected.includes(platform);
          return (
            <button
              key={platform}
              onClick={() => {
                if (isSelected) {
                  onChange(selected.filter(p => p !== platform));
                } else {
                  onChange([...selected, platform]);
                }
              }}
              className={`platform-filter-btn${isSelected ? ' selected' : ''}`}
            >
              <span className="platform-filter-emoji">{platformData.emoji}</span>
              {platform}
            </button>
          );
        })}
      </ChipRow>    </div>
  );
}
