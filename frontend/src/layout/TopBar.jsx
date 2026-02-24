import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './layout.css';

export default function TopBar() {
  const { user } = useAuth();

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <h1 className="top-bar-title">Seen</h1>
        <p className="top-bar-subtitle">Your streaming companion</p>
      </div>

      <div className="top-bar-right">
        {user && (
          <p className="top-bar-user-info">
            {user.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : user.username || user.email}
          </p>
        )}
      </div>
    </header>
  );
}
