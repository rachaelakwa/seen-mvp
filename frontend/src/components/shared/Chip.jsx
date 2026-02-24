import React from 'react';
import './shared.css';

export default function Chip({ label, icon, isSelected = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`chip${isSelected ? ' chip--selected' : ''}`}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      {label}
    </button>
  );
}
