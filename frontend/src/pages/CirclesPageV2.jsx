import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import CirclesRow from '../components/circles/CirclesRow';
import RecentActivityGroup from '../components/circles/RecentActivityGroup';
import { FRIENDS, FRIEND_RECS, FRIEND_ACTIVITY } from '../data/circles';
import { getTitleById, getSortedFriendRecs, getFriendById, getRecentActivity, groupActivityByFriend } from '../utils/circlesLogic';
import { savesService } from '../services/saves.js';
import { recsService } from '../services/recs.js';
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

export default function CirclesPageV2() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [inboxRecs, setInboxRecs] = useState([]);
  const [inboxLoaded, setInboxLoaded] = useState(false);

  useEffect(() => {
    recsService.getInbox()
      .then(({ recs }) => {
        if (recs.length > 0) {
          const mapped = recs.map(r => ({
            id: r._id,
            friendId: r.senderId?._id || r.senderId,
            friendEmail: r.senderId?.email,
            titleId: r.titleId,
            note: r.note || '',
            moodId: r.moodId,
            createdAt: r.createdAt,
          }));
          setInboxRecs(mapped);
        }
        setInboxLoaded(true);
      })
      .catch(() => setInboxLoaded(true));
  }, []);

  const handleSaveToShelf = useCallback(async (titleId) => {
    if (savedIds.has(titleId)) return;
    try {
      await savesService.createSave(titleId);
      setSavedIds(prev => new Set(prev).add(titleId));
    } catch (err) {
      if (err.message?.includes('Already saved')) {
        setSavedIds(prev => new Set(prev).add(titleId));
      }
    }
  }, [savedIds]);

  const handleAccept = useCallback(async (titleId) => {
    await handleSaveToShelf(titleId);
  }, [handleSaveToShelf]);

  const handleDecline = (recId) => {
    console.log('Decline recommendation:', recId);
  };

  const handleSendRecommendation = async () => {
    if (selectedTitle && selectedFriends.length > 0 && message.trim()) {
      try {
        for (const friendId of selectedFriends) {
          await recsService.sendRec(friendId, selectedTitle, null, message);
        }
      } catch (err) {
        console.error('Send failed (friends may need real user IDs):', err);
      }
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

  const recSource = inboxLoaded && inboxRecs.length > 0 ? inboxRecs : FRIEND_RECS;
  const sortedRecs = getSortedFriendRecs(recSource);
  const recentActivity = getRecentActivity(FRIEND_ACTIVITY);
  const groupedActivity = groupActivityByFriend(recentActivity, FRIENDS);
  
  let filteredRecs = sortedRecs;
  if (filter !== 'all') {
    filteredRecs = sortedRecs.filter(rec => rec.friendId === filter);
  }
  if (searchQuery) {
    filteredRecs = filteredRecs.filter(rec => {
      const title = getTitleById(rec.titleId);
      return title?.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  const isFormValid = selectedTitle && selectedFriends.length > 0 && message.trim();

  return (
    <PageContainer>
      <div className="circles-v2-container">
        <SectionTitle>Your circles</SectionTitle>
        
        <CirclesRow friends={FRIENDS} />

        <button
          className="recommend-btn"
          onClick={() => setShowCompose(true)}
        >
          + Recommend for a friend
        </button>

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

        <div className="recs-section">
          <div className="filter-bar">
            <select 
              className={`filter-select ${filter === 'all' ? 'active' : ''}`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Friends</option>
              {FRIENDS.map(friend => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>

            <input
              className="search-input"
              type="text"
              placeholder="Search shows & movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="recs-list">
            {filteredRecs.length === 0 ? (
              <div className="empty-state">
                {searchQuery ? 'No recommendations found for your search' : 'No recommendations yet'}
              </div>
            ) : (
              filteredRecs.map(rec => {
                const friend = getFriendById(FRIENDS, rec.friendId);
                const title = getTitleById(rec.titleId);
                
                return (
                  <div key={rec.id} className="rec-item">
                    <div className="rec-sender">
                      {friend?.name || rec.friendEmail || 'A friend'}
                    </div>

                    <div className="rec-bubble">
                      <img
                        className="rec-thumbnail"
                        src={title?.imageUrl}
                        alt={title?.title}
                      />

                      <div className="rec-content">
                        <h3 className="rec-title">
                          {title?.title}
                        </h3>
                        <p className="rec-note">
                          {rec.note}
                        </p>
                        <p className="rec-timestamp">
                          {new Date(rec.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        <div className="rec-actions">
                          <button
                            className={`rec-save-btn ${savedIds.has(rec.titleId) ? 'saved' : ''}`}
                            onClick={() => handleAccept(rec.titleId)}
                            disabled={savedIds.has(rec.titleId)}
                          >
                            {savedIds.has(rec.titleId) ? 'Saved' : 'Save'}
                          </button>
                          <button
                            className="rec-ignore-btn"
                            onClick={() => handleDecline(rec.id)}
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="activity-section">
          <h2 className="section-heading">
            Friends' activity
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
