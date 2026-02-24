import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { TAB_IDS } from '../app/constants';
import { FiUser, FiLogOut } from 'react-icons/fi';
import './layout.css';

export default function BottomNav({ activeTab, onTabChange }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const tabs = [
    { id: TAB_IDS.MOOD, label: 'Mood' },
    { id: TAB_IDS.CIRCLES, label: 'Circles' },
    { id: TAB_IDS.VIBESHELF, label: 'Vibeshelf' },
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

        {/* Main Navigation Tabs */}
        <div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`bottom-nav-tab${activeTab === tab.id ? ' bottom-nav-tab--active' : ''}`}
            >
              {tab.label}
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
