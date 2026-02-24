import React from 'react';
import './vibeshelf.css';

export default function PatternBanner() {
  return (
    <div className="pattern-banner">
      <h3 className="pattern-banner-title">
        ✨ Your watching pattern
      </h3>
      <div className="pattern-banner-content">
        <p className="pattern-banner-text">
          You often reach for cozy shows after work. Documentaries give you a reset.
        </p>
        <div className="pattern-banner-badge">
          🔒 Private
        </div>
      </div>
    </div>
  );
}
