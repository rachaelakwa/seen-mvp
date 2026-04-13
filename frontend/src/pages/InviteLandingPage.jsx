import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PageContainer from '../components/shared/PageContainer';
import SectionTitle from '../components/shared/SectionTitle';
import { invitesService } from '../services/invites.js';
import '../components/circles/circles.css';

function inviterName(inviter = {}) {
  if (inviter.firstName || inviter.lastName) {
    return `${inviter.firstName || ''} ${inviter.lastName || ''}`.trim();
  }
  return inviter.username || inviter.email || 'A friend';
}

export default function InviteLandingPage() {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionState, setActionState] = useState('');

  useEffect(() => {
    if (!token) return;
    invitesService.getLinkPreview(token)
      .then(({ invite: data }) => setInvite(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const nextQuery = useMemo(() => `?next=${encodeURIComponent(`/invite/${token}`)}`, [token]);

  const handleJoin = async () => {
    if (!token) return;
    setActionState('Sending request...');
    try {
      const response = await invitesService.useLink(token);
      if (response.alreadyConnected) {
        setActionState('You are already connected.');
        return;
      }
      setActionState('Invite request sent.');
      window.setTimeout(() => navigate('/invite-inbox'), 1000);
    } catch (err) {
      setActionState(err.message);
    }
  };

  return (
    <PageContainer>
      <div className="invite-page-container">
        <button className="invite-back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <SectionTitle>Join a circle</SectionTitle>
        <div className="invite-link-card">
          {loading ? <p>Loading invite...</p> : null}
          {!loading && error ? <p>{error}</p> : null}
          {!loading && !error && invite ? (
            <>
              <p className="invite-link-title">{inviterName(invite.inviter)} invited you to Seen circles</p>
              <p className="invite-link-meta">
                Build your circle, trade recommendations, and save each other&apos;s picks.
              </p>
              {!invite.usable ? <p>This invite link is no longer active.</p> : null}

              {!user ? (
                <div className="invite-link-actions">
                  <Link to={`/login${nextQuery}`} className="recommend-btn">Log in to continue</Link>
                  <Link to={`/signup${nextQuery}`} className="recommend-btn">Create account</Link>
                </div>
              ) : (
                <div className="invite-link-actions">
                  <button className="recommend-btn" onClick={handleJoin} disabled={!invite.usable}>
                    Send join request
                  </button>
                </div>
              )}
              {actionState ? <p className="invite-inbox-meta">{actionState}</p> : null}
            </>
          ) : null}
        </div>
      </div>
    </PageContainer>
  );
}
