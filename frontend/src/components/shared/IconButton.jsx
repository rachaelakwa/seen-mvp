import React from 'react';
import './shared.css';

export default function IconButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="icon-button"
    >
      {icon}
    </button>
  );
}
