import React from 'react';
import { getInitials } from '../../utils/format';
import './circles.css';

export default function FriendBubble({ message }) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const colorIndex = message.friendId.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="friend-bubble">
      <div
        className="friend-bubble-avatar"
        style={{ background: bgColor }}
      >
        {getInitials(message.friendName)}
      </div>
      <div className="friend-bubble-content">
        <p className="friend-bubble-name">
          {message.friendName}
        </p>
        <p className="friend-bubble-text">
          {message.text}
        </p>
      </div>
    </div>
  );
}
