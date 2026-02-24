import React from 'react';
import FriendBubble from './FriendBubble';
import { useFriendsMessages } from '../../state/useSeenStore';
import './circles.css';

export default function FriendsSayingList() {
  const { messages } = useFriendsMessages();

  return (
    <div className="friends-saying-list">
      {messages.map(msg => (
        <FriendBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}
