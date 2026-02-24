import React from 'react';
import TogglePill from '../shared/TogglePill';
import './mood.css';

export default function PicksHeader({ value, onChange }) {
  return (
    <div className="picks-header">
      <h3 className="picks-header-title">
        Picks for you
      </h3>
      <TogglePill
        value={value}
        options={[
          { value: 3, label: '3 picks' },
          { value: 5, label: '5 picks' },
        ]}
        onChange={onChange}
      />
    </div>
  );
}
