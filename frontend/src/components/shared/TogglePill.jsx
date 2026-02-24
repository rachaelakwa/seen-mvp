import React from 'react';
import './shared.css';

export default function TogglePill({ value, options, onChange }) {
  return (
    <div className="toggle-pill">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`toggle-pill-button${value === option.value ? ' toggle-pill-button--active' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
