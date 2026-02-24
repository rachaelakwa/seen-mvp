import React from 'react';
import CircleAvatar from './CircleAvatar';
import './circles.css';

export default function RecentActivityItem({ item, friend, title, onSave, relativeTime }) {
  if (!title) return null;

  return (
    <div className="recent-activity-item">
      <div className="recent-activity-item-thumbnail">
        <img
          src={title.imageUrl}
          alt={title.title}
          className="recent-activity-item-image"
        />
      </div>

      <div className="recent-activity-item-content">
        <h4 className="recent-activity-item-title">
          {title.title}
        </h4>
        <p className="recent-activity-item-platform">
          {title.platform}
        </p>
        <span className="recent-activity-item-time">
          watched {relativeTime}
        </span>
        <div>
          <button
            onClick={() => onSave(title.id)}
            className="recent-activity-item-save-btn"
          >
            ♡ Save
          </button>
        </div>
      </div>
    </div>
  );
}
