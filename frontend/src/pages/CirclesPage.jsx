import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import CirclesRow from '../components/circles/CirclesRow';
import RecentActivityGroup from '../components/circles/RecentActivityGroup';
import TutorialPointer from '../components/TutorialPointer';
import { PICKS } from '../data/picks';
import { FRIENDS, FRIEND_RECS, FRIEND_ACTIVITY } from '../data/circles';
import { getTitleById, getSortedFriendRecs, getFriendById, getRecentActivity, groupActivityByFriend } from '../utils/circlesLogic';
import { savesService } from '../services/saves.js';
import { recsService } from '../services/recs.js';
import { friendsService } from '../services/friends.js';
import { invitesService } from '../services/invites.js';
import '../components/circles/circles.css';

const TITLE_OPTIONS = PICKS.map((pick) => ({ id: pick.id, title: pick.title }));
const AVATAR_COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00b894', '#e17055', '#0984e3'];
const UNKNOWN_TITLE_IMAGE = 'https://via.placeholder.com/60x90/e5e7eb/111827?text=Seen';

function getUserDisplayName(user = {}) {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.username || user.email || 'Friend';
}

function getInitials(name = 'Friend') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'F';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function getColorForId(id = '') {
  const sum = [...String(id)].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

const tutorialSteps = [
  {
    title: 'Your Circles',
    description: 'Your friends share recommendations here. See what your circles are watching and get inspired.'
  },
  {
    title: 'Send Recommendations',
    description: 'Share shows and movies you love with your friends. Click the send button to recommend something.'
  },
  {
    title: 'Take Action',
    description: 'Save recommendations you want to watch or pass on ones you don\'t. Building your watchlist has never been easier.'
  }
];

export default function CirclesPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [friends, setFriends] = useState(FRIENDS);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [inboxRecs, setInboxRecs] = useState([]);
  const [inboxLoaded, setInboxLoaded] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copyState, setCopyState] = useState('');
  const [dismissedRecIds, setDismissedRecIds] = useState(new Set());
  const [composeError, setComposeError] = useState('');

  useEffect(() => {
    friendsService.getFriends()
      .then(({ friends: apiFriends }) => {
        if (Array.isArray(apiFriends) && apiFriends.length > 0) {
          const mapped = apiFriends.map((friend) => {
            const name = getUserDisplayName(friend);
            return {
              id: friend.id,
              name,
              initials: getInitials(name),
              color: getColorForId(friend.id),
            };
          });
          setFriends(mapped);
        }
        setFriendsLoaded(true);
      })
      .catch(() => setFriendsLoaded(true));
  }, []);

  useEffect(() => {
    invitesService.getMyLink()
      .then(({ invite }) => setInviteLink(invite.shareUrl))
      .catch(() => setInviteLink(''));
  }, []);

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

  useEffect(() => {
    savesService.getSaves()
      .then(({ saves }) => setSavedIds(new Set(saves.map(s => s.titleId))))
      .catch(() => {});
  }, []);

  const handleSaveToShelf = useCallback(async (titleId, moodId) => {
    if (savedIds.has(titleId)) return;
    try {
      await savesService.createSave(titleId, moodId);
      setSavedIds(prev => new Set(prev).add(titleId));
    } catch (err) {
      if (err.message?.includes('Already saved')) {
        setSavedIds(prev => new Set(prev).add(titleId));
      } else {
        console.error('Save failed:', err);
      }
    }
  }, [savedIds]);

  const handleAccept = useCallback(async (rec) => {
    await handleSaveToShelf(rec.titleId, rec.moodId);
    setDismissedRecIds(prev => new Set(prev).add(rec.id));
  }, [handleSaveToShelf]);

  const handleDecline = (recId) => {
    setDismissedRecIds(prev => new Set(prev).add(recId));
  };

  const handleSendRecommendation = async () => {
    if (selectedTitle && selectedFriends.length > 0) {
      setComposeError('');
      try {
        for (const friendId of selectedFriends) {
          await recsService.sendRec(friendId, selectedTitle, null, message);
        }
        setComposeError('');
      } catch (err) {
        setComposeError(err.message || 'Could not send recommendation right now.');
      }
      setSelectedTitle('');
      setSelectedFriends([]);
      setMessage('');
      setShowCompose(false);
    }
  };

  const handleCopyInviteLink = useCallback(async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyState('Copied');
      window.setTimeout(() => setCopyState(''), 2000);
    } catch {
      // Fallback for environments where clipboard API is unavailable.
      window.prompt('Copy your invite link:', inviteLink);
      setCopyState('Link ready');
      window.setTimeout(() => setCopyState(''), 2000);
    }
  }, [inviteLink]);

  const handleGenerateInviteLink = useCallback(async () => {
    try {
      const { invite } = await invitesService.rotateMyLink();
      setInviteLink(invite.shareUrl);
      setCopyState('Link ready');
      window.setTimeout(() => setCopyState(''), 2000);
    } catch {
      setCopyState('Could not create link');
      window.setTimeout(() => setCopyState(''), 2000);
    }
  }, []);

  const toggleFriend = (friendId) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const closeCompose = () => {
    setShowCompose(false);
    setSelectedTitle('');
    setSelectedFriends([]);
    setMessage('');
  };

  const friendsSource = friendsLoaded && friends.length > 0 ? friends : FRIENDS;
  const recSource = inboxLoaded && inboxRecs.length > 0 ? inboxRecs : FRIEND_RECS;
  const sortedRecs = getSortedFriendRecs(recSource);
  const recentActivity = getRecentActivity(FRIEND_ACTIVITY);
  const groupedActivity = groupActivityByFriend(recentActivity, friendsSource);

  let filteredRecs = sortedRecs.filter(rec => !dismissedRecIds.has(rec.id));
  if (filter !== 'all') {
    filteredRecs = sortedRecs.filter(rec => rec.friendId === filter);
  }
  if (searchQuery) {
    filteredRecs = filteredRecs.filter(rec => {
      const title = getTitleById(rec.titleId);
      const titleText = (title?.title || rec.titleId || '').toLowerCase();
      return titleText.includes(searchQuery.toLowerCase());
    });
  }

  const isFormValid = selectedTitle && selectedFriends.length > 0;

  return (
    <>
      <TutorialPointer tutorialId="circles_page_intro" steps={tutorialSteps} />
      <PageContainer>
        <div className="circles-v2-container">
          <SectionTitle>Your circles</SectionTitle>

          <CirclesRow friends={friendsSource} />

          <div className="circles-actions-row">
            <div className="invite-link-card">
              <p className="invite-link-title">Invite friends with your link</p>
              <p className="invite-link-url">{inviteLink || 'No link yet. Generate one below.'}</p>
              <div className="invite-link-actions">
                {inviteLink ? (
                  <button
                    className="recommend-btn"
                    onClick={handleCopyInviteLink}
                  >
                    {copyState || 'Copy invite link'}
                  </button>
                ) : (
                  <button
                    className="recommend-btn"
                    onClick={handleGenerateInviteLink}
                  >
                    {copyState || 'Generate invite link'}
                  </button>
                )}
                <Link className="recommend-btn" to="/invite-inbox">
                  Open invite inbox
                </Link>
              </div>
            </div>

            <div className="circles-compose-card">
              <p className="circles-compose-card-title">Share a recommendation</p>
              <p className="circles-compose-card-note">
                Pick a title and send it directly to someone in your circles.
              </p>
              <button
                className="recommend-btn"
                onClick={() => setShowCompose(true)}
              >
                + Recommend for a friend
              </button>
            </div>
          </div>

          {showCompose && (
            <div className="modal-overlay" onClick={closeCompose}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Send a recommendation</h3>

                <div className="modal-field">
                  <label className="modal-label">What do you want to recommend?</label>
                  <select
                    className="modal-select"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                  >
                    <option value="">Select a show or movie...</option>
                    {TITLE_OPTIONS.map(title => (
                      <option key={title.id} value={title.id}>{title.title}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-label-spaced">Send to which friends?</label>
                  <div className="modal-friend-list">
                    {friendsSource.map(friend => (
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
                    Add a message <span className="modal-label-optional">(optional)</span>
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
                  <button className="modal-cancel-btn" onClick={closeCompose}>
                    Cancel
                  </button>
                </div>
                {composeError ? <p className="circles-compose-error">{composeError}</p> : null}
              </div>
            </div>
          )}

          <div className="recs-section">
            <div className="section-header-row">
              <h2 className="section-heading">Recommendations</h2>
              <span className="section-count-chip">{filteredRecs.length}</span>
            </div>
            <div className="filter-bar">
              <select
                className={`filter-select ${filter === 'all' ? 'active' : ''}`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Friends</option>
                {friendsSource.map(friend => (
                  <option key={friend.id} value={friend.id}>{friend.name}</option>
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
                  const friend = getFriendById(friendsSource, rec.friendId);
                  const senderName = friend?.name || rec.friendEmail || 'A friend';
                  const title = getTitleById(rec.titleId) || {
                    title: rec.titleId,
                    imageUrl: UNKNOWN_TITLE_IMAGE,
                  };
                  return (
                    <div key={rec.id} className="rec-item">
                      <div className="rec-sender">
                        <span className="rec-sender-avatar">{getInitials(senderName)}</span>
                        <span>{senderName}</span>
                      </div>
                      <div className="rec-bubble">
                        <img
                          className="rec-thumbnail"
                          src={title.imageUrl}
                          alt={title.title}
                        />
                        <div className="rec-content">
                          <h3 className="rec-title">{title.title}</h3>
                          <p className="rec-note">{rec.note}</p>
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
                              onClick={() => handleAccept(rec)}
                              disabled={savedIds.has(rec.titleId)}
                            >
                              {savedIds.has(rec.titleId) ? 'Saved' : 'Save'}
                            </button>
                            <button
                              className="rec-ignore-btn"
                              onClick={() => handleDecline(rec.id)}
                            >
                              Not now
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
            <div className="section-header-row">
              <h2 className="section-heading">Friends' activity</h2>
              <span className="section-count-chip">{groupedActivity.length}</span>
            </div>
            <div>
              {groupedActivity.map(group => (
                <RecentActivityGroup
                  key={group.friendId}
                  friendGroup={group}
                  onSave={handleSaveToShelf}
                  savedIds={savedIds}
                />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
