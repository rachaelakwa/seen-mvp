import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { TAB_IDS } from '../app/constants';
import './layout.css';

const routeToTab = {
  '/mood': TAB_IDS.MOOD,
  '/circles': TAB_IDS.CIRCLES,
  '/vibeshelf': TAB_IDS.VIBESHELF,
};

export default function MainLayout({ children, showTabs = true }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(TAB_IDS.MOOD);

  // Sync state with URL on mount and when URL changes
  useEffect(() => {
    const tab = routeToTab[location.pathname];
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.pathname]);

  // If children is AppShell, pass the tab state to it
  const childrenWithProps = React.cloneElement(children, { activeTab, onTabChange: setActiveTab });

  return (
    <div className="main-layout">
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-layout-content">
        <TopBar />
        <main className="main-layout-main">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}
