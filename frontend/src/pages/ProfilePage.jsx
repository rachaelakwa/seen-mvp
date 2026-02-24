import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PageContainer from '../components/shared/PageContainer';
import TutorialPointer from '../components/TutorialPointer';
import { authService } from '../services/auth.js';
import './profile.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tutorialSteps = [
    {
      title: 'Your Profile',
      description: 'Manage your account information and personal details here.'
    },
    {
      title: 'Password Security',
      description: 'Change your password anytime to keep your account secure.'
    }
  ];

  useEffect(() => {
    if (user) {
      if (user.username) setUsername(user.username);
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
    }
  }, [user]);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!username.trim()) {
        setError('Username cannot be empty');
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setIsLoading(false);
        return;
      }

      await authService.updateProfile(username);
      setSuccess('Username updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('All password fields are required');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <TutorialPointer tutorialId="profile_page_intro" steps={tutorialSteps} />
      <div className="profile-container">
        <h1 className="profile-title">
          Profile Settings
        </h1>

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success">
            {success}
          </div>
        )}

        {/* Email Display */}
        <div className="profile-section">
          <label className="profile-label profile-label--muted">
            Email
          </label>
          <div className="profile-email-display">
            {user?.email || 'Loading...'}
          </div>
          <p className="profile-hint">Email cannot be changed</p>
        </div>

        {/* First Name */}
        <div className="profile-field-group">
          <label className="profile-label">
            First Name
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Last Name */}
        <div className="profile-field-group--large">
          <label className="profile-label">
            Last Name
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="profile-input"
          />
        </div>

        {/* Username Update Form */}
        <form onSubmit={handleUsernameUpdate} className="profile-form">
          <h2 className="profile-form-title">
            Update Username
          </h2>
          <div className="profile-form-group">
            <label
              htmlFor="username"
              className="profile-label profile-label--dark"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="profile-input"
              placeholder="Enter your username"
            />
            <p className="profile-hint">
              Minimum 3 characters, must be unique
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="profile-submit-btn"
          >
            {isLoading ? 'Updating...' : 'Update Username'}
          </button>
        </form>

        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange}>
          <h2 className="profile-form-title">
            Change Password
          </h2>

          <div className="profile-form-group">
            <label
              htmlFor="currentPassword"
              className="profile-label profile-label--dark"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="profile-input"
              placeholder="Enter current password"
            />
          </div>

          <div className="profile-form-group">
            <label
              htmlFor="newPassword"
              className="profile-label profile-label--dark"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="profile-input"
              placeholder="Enter new password"
            />
            <p className="profile-hint">
              Minimum 6 characters
            </p>
          </div>

          <div className="profile-form-group--last">
            <label
              htmlFor="confirmPassword"
              className="profile-label profile-label--dark"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="profile-input"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="profile-submit-btn"
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
