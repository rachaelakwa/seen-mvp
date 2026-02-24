import React, { useState } from 'react';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import CirclesRow from '../components/circles/CirclesRow';
import FriendRecCard from '../components/circles/FriendRecCard';
import RecentActivityGroup from '../components/circles/RecentActivityGroup';
import { FRIENDS, FRIEND_RECS, FRIEND_ACTIVITY } from '../data/circles';
import { getTitleById, getSortedFriendRecs, getRecentActivity, groupActivityByFriend, getFriendById } from '../utils/circlesLogic';
import '../components/circles/circles.css';

const ALL_TITLES = [
  { id: 'soft_1', title: 'Studio Ghibli Collection', image: 'https://via.placeholder.com/60x90/667eea/ffffff?text=Ghibli' },
  { id: 'soft_2', title: 'Spirited Away', image: 'https://via.placeholder.com/60x90/764ba2/ffffff?text=Spirited' },
  { id: 'soft_3', title: 'The Crown', image: 'https://via.placeholder.com/60x90/f093fb/ffffff?text=Crown' },
  { id: 'soft_5', title: 'Pride and Prejudice', image: 'https://via.placeholder.com/60x90/4facfe/ffffff?text=Pride' },
  { id: 'fried_1', title: 'The Office', image: 'https://via.placeholder.com/60x90/00f2fe/ffffff?text=Office' },
  { id: 'fried_2', title: 'Parks & Rec', image: 'https://via.placeholder.com/60x90/667eea/ffffff?text=Parks' },
  { id: 'fried_4', title: 'Brooklyn 99', image: 'https://via.placeholder.com/60x90/764ba2/ffffff?text=B99' },
  { id: 'drained_1', title: 'Succession', image: 'https://via.placeholder.com/60x90/f093fb/ffffff?text=Succession' },
  { id: 'drained_2', title: 'Breaking Bad', image: 'https://via.placeholder.com/60x90/4facfe/ffffff?text=Breaking' },
  { id: 'drained_4', title: 'The Last of Us', image: 'https://via.placeholder.com/60x90/00f2fe/ffffff?text=TLOU' },
  { id: 'chaotic_1', title: 'Euphoria', image: 'https://via.placeholder.com/60x90/667eea/ffffff?text=Euphoria' },
  { id: 'chaotic_3', title: 'Hannibal', image: 'https://via.placeholder.com/60x90/764ba2/ffffff?text=Hannibal' },
  { id: 'chaotic_5', title: 'Squid Game', image: 'https://via.placeholder.com/60x90/f093fb/ffffff?text=Squid' },
  { id: 'locked_1', title: 'Oppenheimer', image: 'https://via.placeholder.com/60x90/4facfe/ffffff?text=Oppie' },
  { id: 'locked_2', title: 'Twisters', image: 'https://via.placeholder.com/60x90/00f2fe/ffffff?text=Twisters' },
  { id: 'locked_5', title: 'Dune', image: 'https://via.placeholder.com/60x90/667eea/ffffff?text=Dune' },
];

export default function CirclesPageV1() {
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [message, setMessage] = useState('');

  const handleSaveToShelf = (titleId) => {
    console.log('Save to shelf:', titleId);
  };

  const handleSendRecommendation = () => {
    if (selectedTitle && selectedFriends.length > 0 && message.trim()) {
      console.log('Sending recommendation:', {
        title: selectedTitle,
        friends: selectedFriends,
        message: message,
      });
      setSelectedTitle('');
      setSelectedFriends([]);
      setMessage('');
      setShowCompose(false);
    }
  };

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const sortedRecs = getSortedFriendRecs(FRIEND_RECS);
  const recentActivity = getRecentActivity(FRIEND_ACTIVITY);
  const groupedActivity = groupActivityByFriend(recentActivity, FRIENDS);

  const isFormValid = selectedTitle && selectedFriends.length > 0 && message.trim();

  return (
    <PageContainer>
      <div className="circles-v1-container">
        <SectionTitle>Your circles</SectionTitle>
        
        {/* Friends Row */}
        <CirclesRow friends={FRIENDS} />

        {/* Send Recommendation Button */}
        <button
          className="recommend-btn"
          onClick={() => setShowCompose(true)}
        >
          + Recommend for a friend
        </button>

        {/* Recommend Modal */}
        {showCompose && (
          <div className="modal-overlay"
          onClick={() => {
            setShowCompose(false);
            setSelectedTitle('');
            setSelectedFriends([]);
            setMessage('');
          }}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              Send a recommendation
            </h3>

            {/* Title Selection */}
            <div className="modal-field">
              <label className="modal-label">
                What do you want to recommend?
              </label>
              <select
                className="modal-select"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
              >
                <option value="">Select a show or movie...</option>
                {ALL_TITLES.map(title => (
                  <option key={title.id} value={title.id}>
                    {title.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Friend Selection */}
            <div className="modal-field">
              <label className="modal-label-spaced">
                Send to which friends?
              </label>
              <div className="modal-friend-list">
                {FRIENDS.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`modal-friend-btn ${selectedFriends.includes(friend.id) ? 'selected' : ''}`}
                  >
                    {friend.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="modal-field">
              <label className="modal-label">
                Add a message (why are you recommending this?)
              </label>
              <textarea
                className="modal-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="E.g., 'This is exactly your kind of show!' or 'Trust me on this one...'"
              />
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                className="modal-send-btn"
                onClick={handleSendRecommendation}
                disabled={!isFormValid}
              >
                Send →
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => {
                  setShowCompose(false);
                  setSelectedTitle('');
                  setSelectedFriends([]);
                  setMessage('');
                }}
              >
                Cancel
              </button>
            </div>
            </div>
          </div>
        )}

        {/* Friends' Picks for You Section */}
        <div className="friends-picks-section">
          <h2 className="section-heading">
            Friends' picks for you
          </h2>
          <div className="recs-grid">
            {sortedRecs.map(rec => {
              const friend = getFriendById(FRIENDS, rec.friendId);
              const title = getTitleById(rec.titleId);
              return (
                <FriendRecCard
                  key={rec.id}
                  rec={rec}
                  friend={friend}
                  title={title}
                  onSave={handleSaveToShelf}
                />
              );
            })}
          </div>
        </div>

        {/* Recently Watched Section */}
        <div>
          <h2 className="section-heading">
            Recently watched
          </h2>
          <div>
            {groupedActivity.map(group => (
              <RecentActivityGroup
                key={group.friendId}
                friendGroup={group}
                onSave={handleSaveToShelf}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
