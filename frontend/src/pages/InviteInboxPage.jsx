import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import { invitesService } from '../services/invites.js';
import { friendsService } from '../services/friends.js';
import '../components/circles/circles.css';

function userName(user = {}) {
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }
  return user.username || user.email || 'Friend';
}

export default function InviteInboxPage() {
  const navigate = useNavigate();
  const [inviteLink, setInviteLink] = useState('');
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [copyState, setCopyState] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [{ invite }, { requests: incomingRequests }, { requests: sentRequests }] = await Promise.all([
        invitesService.getMyLink(),
        friendsService.getIncomingRequests(),
        friendsService.getSentRequests(),
      ]);
      setInviteLink(invite.shareUrl);
      setIncoming(incomingRequests || []);
      setSent(sentRequests || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [load]);

  const onCopy = useCallback(async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyState('Copied');
      window.setTimeout(() => setCopyState(''), 2000);
    } catch {
      setCopyState('Copy failed');
      window.setTimeout(() => setCopyState(''), 2000);
    }
  }, [inviteLink]);

  const onAccept = async (requestId) => {
    await friendsService.acceptRequest(requestId);
    setIncoming((prev) => prev.map((request) => (
      request.id === requestId ? { ...request, status: 'accepted' } : request
    )));
  };

  const onDecline = async (requestId) => {
    await friendsService.declineRequest(requestId);
    setIncoming((prev) => prev.map((request) => (
      request.id === requestId ? { ...request, status: 'declined' } : request
    )));
  };

  const listItems = activeTab === 'incoming' ? incoming : sent;
  const isIncomingTab = activeTab === 'incoming';

  return (
    <PageContainer>
      <div className="invite-page-container">
        <button className="invite-back-btn" onClick={() => navigate('/circles')}>
          ← Back to circles
        </button>
        <div className="invite-page-heading">
          <SectionTitle>Invite</SectionTitle>
          <p className="invite-page-subtitle">Manage incoming requests and keep your invite link handy.</p>
        </div>

        <div className="invite-link-card">
          <p className="invite-link-title">Your invite link</p>
          <p className="invite-link-url">{inviteLink || 'Loading invite link...'}</p>
          <div className="invite-link-actions">
            <button className="recommend-btn" onClick={onCopy} disabled={!inviteLink}>
              {copyState || 'Copy invite link'}
            </button>
          </div>
        </div>

        <div className="invite-inbox-section">
          <div className="invite-inbox-toggle">
            <button
              className={`invite-toggle-btn ${isIncomingTab ? 'active' : ''}`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming ({incoming.length})
            </button>
            <button
              className={`invite-toggle-btn ${!isIncomingTab ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Outgoing ({sent.length})
            </button>
          </div>

          {loading ? <p>Loading...</p> : null}
          {!loading && listItems.length === 0 ? (
            <p className="empty-state">
              {isIncomingTab ? 'No incoming requests yet.' : 'No outgoing requests yet.'}
            </p>
          ) : null}

          {listItems.map((request) => (
            <div key={request.id} className="invite-inbox-card">
              <div className="invite-inbox-row">
                <div>
                  <p className="invite-inbox-name">{userName(request.user)}</p>
                  <p className="invite-inbox-meta">
                    {isIncomingTab ? 'Requested' : 'Sent'} {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {isIncomingTab && request.status === 'pending' ? (
                  <div className="invite-inbox-actions">
                    <button className="invite-inbox-btn primary" onClick={() => onAccept(request.id)}>
                      Accept
                    </button>
                    <button className="invite-inbox-btn" onClick={() => onDecline(request.id)}>
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="invite-status-chip">{request.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
