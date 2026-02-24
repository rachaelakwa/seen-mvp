import { PICKS } from '../data/picks';

export function getFriendById(friends, friendId) {
  return friends.find(f => f.id === friendId);
}

export function getTitleById(titleId) {
  return PICKS.find(pick => pick.id === titleId);
}

export function getSortedFriendRecs(recs) {
  return [...recs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getRecentActivity(activity) {
  return [...activity].sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
}

export function groupActivityByFriend(activity, friends) {
  const grouped = {};
  
  activity.forEach(item => {
    if (!grouped[item.friendId]) {
      grouped[item.friendId] = [];
    }
    grouped[item.friendId].push(item);
  });

  // Sort each friend's activity by date DESC and limit to 2 items
  const result = Object.entries(grouped).map(([friendId, items]) => ({
    friendId,
    friend: friends.find(f => f.id === friendId),
    items: items.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)).slice(0, 2),
  }));

  // Sort friend groups by most recent activity
  return result.sort((a, b) => {
    const aTime = a.items[0]?.occurredAt || '2000-01-01';
    const bTime = b.items[0]?.occurredAt || '2000-01-01';
    return new Date(bTime) - new Date(aTime);
  });
}

export function getRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
