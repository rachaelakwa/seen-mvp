import React from 'react';
import CircleAvatar from './CircleAvatar';
import './circles.css';

export default function CirclesRow({ friends }) {
  return (
    <div className="circles-row">
      {friends.map(friend => (
        <div key={friend.id} className="circles-row-item">
          <CircleAvatar friend={friend} size="72px" />
          <span className="circles-row-name">
            {friend.name}
          </span>
        </div>
      ))}
    </div>
  );
}
