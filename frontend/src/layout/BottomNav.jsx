import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { TAB_IDS } from '../app/constants';
import { FiUser, FiLogOut, FiMail, FiSmile, FiUsers, FiBookmark } from 'react-icons/fi';
import './layout.css';

export default function BottomNav({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const tabs = [
    { id: TAB_IDS.MOOD, label: 'Mood', subtitle: 'Your mood, your picks', icon: FiSmile },
    { id: TAB_IDS.CIRCLES, label: 'Circles', subtitle: 'Your social watchlist', icon: FiUsers },
    { id: TAB_IDS.VIBESHELF, label: 'Vibeshelf', subtitle: 'Your saved shows by vibe', icon: FiBookmark },
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    const routes = {
      [TAB_IDS.MOOD]: '/mood',
      [TAB_IDS.CIRCLES]: '/circles',
      [TAB_IDS.VIBESHELF]: '/vibeshelf',
    };
    navigate(routes[tabId]);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleInviteClick = () => {
    navigate('/invite-inbox');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bottom-nav">
      {/* Profile Button at Top */}
      <div>
        <button
          onClick={handleProfileClick}
          className="bottom-nav-profile-btn"
        >
          <FiUser size={20} />
          Profile
        </button>
        <button
          onClick={handleInviteClick}
          className={`bottom-nav-invite-btn${location.pathname === '/invite-inbox' ? ' bottom-nav-invite-btn--active' : ''}`}
        >
          <FiMail size={20} />
          <span className="bottom-nav-invite-content">
            Invite
            <span className="bottom-nav-invite-subtitle">Requests and links</span>
          </span>
        </button>

        {/* Main Navigation Tabs */}
        <div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`bottom-nav-tab${activeTab === tab.id ? ' bottom-nav-tab--active' : ''}`}
            >
              <span className="bottom-nav-tab-icon">
                <tab.icon size={18} />
              </span>
              <span className="bottom-nav-tab-content">
                {tab.label}
                {tab.subtitle && <span className="bottom-nav-tab-subtitle">{tab.subtitle}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="bottom-nav-logout-btn"
      >
        <FiLogOut size={20} />
        Log Out
      </button>
    </nav>
  );
}
