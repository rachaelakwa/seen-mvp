import React from 'react';
import './circles.css';

export default function CircleAvatar({ friend, size = '56px' }) {
  return (
    <div
      className="circle-avatar"
      style={{
        width: size,
        height: size,
        background: friend.color,
      }}
      title={friend.name}
    >
      {friend.initials}
    </div>
  );
}
