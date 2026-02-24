import React from 'react';
import './vibeshelf.css';

export default function AddToShelfButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="add-to-shelf-btn"
    >
      + Add to shelf
    </button>
  );
}
