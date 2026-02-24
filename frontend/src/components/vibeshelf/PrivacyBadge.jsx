import React from 'react';
import './vibeshelf.css';

export default function PrivacyBadge({ isPrivate }) {
  if (!isPrivate) return null;

  return (
    <div className="privacy-badge">
      🔒 Private
    </div>
  );
}
