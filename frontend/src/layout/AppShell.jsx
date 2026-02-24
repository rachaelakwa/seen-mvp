import React from 'react';
import { TAB_IDS } from '../app/constants';
import MoodPage from '../pages/MoodPage';
import CirclesPage from '../pages/CirclesPage';
import VibeshelfPage from '../pages/VibeshelfPage';

const pages = {
  [TAB_IDS.MOOD]: <MoodPage />,
  [TAB_IDS.CIRCLES]: <CirclesPage />,
  [TAB_IDS.VIBESHELF]: <VibeshelfPage />,
};

export default function AppShell({ activeTab = TAB_IDS.MOOD }) {
  return (
    <>
      {pages[activeTab]}
    </>
  );
}
