import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { TutorialContext } from '../context/TutorialContext.jsx';
import { authService } from '../services/auth.js';
import './onboarding.css';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { markTutorialAsViewed } = useContext(TutorialContext);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username.trim()) {
        setError('Username is required');
        setIsLoading(false);
        return;
      }

      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setIsLoading(false);
        return;
      }

      // Update profile with username and name
      const response = await authService.updateProfile(username, firstName, lastName);
      
      // Update the auth context with new user data
      setUser(response.user);
      
      // Mark all tutorials as viewed since user is completing onboarding
      markTutorialAsViewed('mood_page_intro');
      markTutorialAsViewed('circles_page_intro');
      markTutorialAsViewed('vibeshelf_page_intro');
      markTutorialAsViewed('profile_page_intro');
      
      // Redirect to mood page
      navigate('/mood');
    } catch (err) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/mood');
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Welcome to Seen! 👋</h1>
        <p className="onboarding-subtitle">Let's get your profile set up</p>

        {error && (
          <div className="onboarding-error">
            {error}
          </div>
        )}

        <form onSubmit={handleComplete} className="onboarding-form">
          {/* Username */}
          <div className="onboarding-form-group">
            <label className="onboarding-label">
              Username <span className="onboarding-required">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your username"
              className="onboarding-input"
              autoFocus
            />
            <p className="onboarding-hint">3+ characters, no spaces</p>
          </div>

          {/* First Name */}
          <div className="onboarding-form-group">
            <label className="onboarding-label">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              className="onboarding-input"
            />
          </div>

          {/* Last Name */}
          <div className="onboarding-form-group">
            <label className="onboarding-label">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              className="onboarding-input"
            />
          </div>

          {/* Buttons */}
          <div className="onboarding-button-group">
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="onboarding-btn onboarding-btn--primary"
            >
              {isLoading ? 'Setting up...' : 'Get Started →'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              className="onboarding-btn onboarding-btn--secondary"
            >
              Skip for now
            </button>
          </div>
        </form>

        <p className="onboarding-footer">
          You can update these anytime in your profile settings
        </p>
      </div>
    </div>
  );
}
