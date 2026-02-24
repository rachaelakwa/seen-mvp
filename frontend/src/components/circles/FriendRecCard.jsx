import React from 'react';
import VibeTag from '../mood/VibeTag';
import './circles.css';

export default function FriendRecCard({ rec, friend, title, onSave }) {
  if (!friend || !title) return null;

  return (
    <div className="friend-rec-card">
      <img
        src={title.imageUrl}
        alt={title.title}
        className="friend-rec-card-image"
      />
      <div className="friend-rec-card-body">
        <h4 className="friend-rec-card-title">
          {title.title}
        </h4>
        <div className="friend-rec-card-platform-wrapper">
          <span className="friend-rec-card-platform">
            {title.platform}
          </span>
        </div>
        <VibeTag vibe={rec.note} />
        <p className="friend-rec-card-attribution">
          by <strong>{friend.name}</strong>
        </p>
        <div className="friend-rec-card-actions">
          <button
            onClick={() => onSave(title.id)}
            className="friend-rec-card-btn-love"
          >
            ♡ Love
          </button>
          <button className="friend-rec-card-btn-link">
            🔗 Link
          </button>
        </div>
      </div>
    </div>
  );
}
