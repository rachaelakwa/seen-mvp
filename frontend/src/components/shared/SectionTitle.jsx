import React from 'react';
import './shared.css';

export default function SectionTitle({ children }) {
  return (
    <h2 className="section-title">
      {children}
    </h2>
  );
}
