import React from 'react';
import './shared.css';

export default function Card({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
}
