export const FRIENDS = [
  { id: 'friend_1', name: 'Alex', initials: 'AK', color: '#667eea' },
  { id: 'friend_2', name: 'Jordan', initials: 'JW', color: '#764ba2' },
  { id: 'friend_3', name: 'Morgan', initials: 'MJ', color: '#f093fb' },
  { id: 'friend_4', name: 'Casey', initials: 'CR', color: '#4facfe' },
  { id: 'friend_5', name: 'Riley', initials: 'RS', color: '#00f2fe' },
];

export const FRIEND_RECS = [
  {
    id: 'rec_1',
    friendId: 'friend_1',
    titleId: 'soft_1',
    note: 'Perfect for when you need something truly comforting.',
    moodId: 'soft',
    createdAt: '2026-02-14T18:30:00Z',
  },
  {
    id: 'rec_2',
    friendId: 'friend_2',
    titleId: 'fried_1',
    note: 'Greatest comfort show that requires zero brain cells.',
    moodId: 'fried',
    createdAt: '2026-02-15T10:20:00Z',
  },
  {
    id: 'rec_3',
    friendId: 'friend_3',
    titleId: 'drained_2',
    note: 'Emotional but so worth watching.',
    moodId: 'drained',
    createdAt: '2026-02-15T14:45:00Z',
  },
  {
    id: 'rec_4',
    friendId: 'friend_4',
    titleId: 'chaotic_3',
    note: 'Absolute madness. You need to see it.',
    moodId: 'chaotic',
    createdAt: '2026-02-16T08:15:00Z',
  },
  {
    id: 'rec_5',
    friendId: 'friend_5',
    titleId: 'locked_2',
    note: 'So gripping you won\'t be able to stop.',
    moodId: 'lockedin',
    createdAt: '2026-02-16T11:00:00Z',
  },
  {
    id: 'rec_6',
    friendId: 'friend_1',
    titleId: 'soft_5',
    note: 'Romantic and beautiful cinematography.',
    moodId: 'soft',
    createdAt: '2026-02-16T13:30:00Z',
  },
];

export const FRIEND_ACTIVITY = [
  {
    id: 'activity_1',
    friendId: 'friend_1',
    titleId: 'soft_2',
    type: 'watched',
    occurredAt: '2026-02-15T20:00:00Z',
  },
  {
    id: 'activity_2',
    friendId: 'friend_2',
    titleId: 'fried_4',
    type: 'watched',
    occurredAt: '2026-02-15T19:30:00Z',
  },
  {
    id: 'activity_3',
    friendId: 'friend_3',
    titleId: 'drained_4',
    type: 'watched',
    occurredAt: '2026-02-15T17:00:00Z',
  },
  {
    id: 'activity_4',
    friendId: 'friend_4',
    titleId: 'chaotic_1',
    type: 'watched',
    occurredAt: '2026-02-16T02:15:00Z',
  },
  {
    id: 'activity_5',
    friendId: 'friend_5',
    titleId: 'locked_5',
    type: 'watched',
    occurredAt: '2026-02-16T09:45:00Z',
  },
  {
    id: 'activity_6',
    friendId: 'friend_1',
    titleId: 'soft_3',
    type: 'watched',
    occurredAt: '2026-02-14T18:00:00Z',
  },
  {
    id: 'activity_7',
    friendId: 'friend_2',
    titleId: 'fried_2',
    type: 'watched',
    occurredAt: '2026-02-14T16:30:00Z',
  },
  {
    id: 'activity_8',
    friendId: 'friend_3',
    titleId: 'drained_1',
    type: 'watched',
    occurredAt: '2026-02-13T21:00:00Z',
  },
  {
    id: 'activity_9',
    friendId: 'friend_4',
    titleId: 'chaotic_5',
    type: 'watched',
    occurredAt: '2026-02-13T15:20:00Z',
  },
  {
    id: 'activity_10',
    friendId: 'friend_5',
    titleId: 'locked_1',
    type: 'watched',
    occurredAt: '2026-02-13T10:00:00Z',
  },
];

export const FRIEND_MESSAGES = [
  {
    id: '1',
    friendId: 'friend_1',
    friendName: 'Alex',
    text: 'Just finished "Spirited Away" - absolutely loved it!',
  },
  {
    id: '2',
    friendId: 'friend_2',
    friendName: 'Jordan',
    text: 'You should watch "The Office" - totally your style',
  },
  {
    id: '3',
    friendId: 'friend_3',
    friendName: 'Morgan',
    text: 'Binge-watching "Arcane" for the second time 🙌',
  },
];

export default FRIENDS;
