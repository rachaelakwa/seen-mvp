import MoodPage from '../pages/MoodPage';
import CirclesPage from '../pages/CirclesPage';
import VibeshelfPage from '../pages/VibeshelfPage';

export const ROUTES = [
  { id: 'mood', label: 'Mood', component: MoodPage },
  { id: 'circles', label: 'Circles', component: CirclesPage },
  { id: 'vibeshelf', label: 'Vibeshelf', component: VibeshelfPage },
];

export default ROUTES;
