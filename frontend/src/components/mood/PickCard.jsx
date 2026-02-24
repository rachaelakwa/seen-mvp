import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faLink } from '@fortawesome/free-solid-svg-icons';
import VibeTag from './VibeTag';
import PlatformBadge from '../shared/PlatformBadge';
import './mood.css';

export default function PickCard({ pick, onSave, isSaved }) {
  return (
    <div className="pick-card">
      <img
        src={pick.imageUrl}
        alt={pick.title}
        className="pick-card-image"
      />
      <div className="pick-card-body">
        <h4 className="pick-card-title">
          {pick.title}
        </h4>
        <div className="pick-card-platform">
          <PlatformBadge platform={pick.platform} />
        </div>
        <VibeTag vibe={pick.vibeTag} />
        <p className="pick-card-note">
          {pick.friendNote}
        </p>
        <div className="pick-card-actions">
          <button
            className={`pick-card-btn pick-card-btn-love ${isSaved ? 'saved' : ''}`}
            onClick={() => onSave?.(pick.id)}
            disabled={isSaved}
          >
            <FontAwesomeIcon icon={faHeart} className="pick-card-btn-icon" />
            {isSaved ? 'Saved' : 'Love'}
          </button>
          <button className="pick-card-btn pick-card-btn-link">
            <FontAwesomeIcon icon={faLink} className="pick-card-btn-icon" />
            Link
          </button>
        </div>
      </div>
    </div>
  );
}
