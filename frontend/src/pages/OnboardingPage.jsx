import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { authService } from '../services/auth.js';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // Returning users who already have a username skip onboarding
  React.useEffect(() => {
    if (user?.username) {
      navigate('/mood', { replace: true });
    }
  }, [user, navigate]);
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
      
      // Redirect to mood page
      navigate('/mood');
    } catch (err) {
      setError(err.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping for now, can require later
    navigate('/mood');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Seen! 👋</h1>
        <p style={styles.subtitle}>Let's get your profile set up</p>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleComplete} style={styles.form}>
          {/* Username */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Username <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose your username"
              style={styles.input}
              autoFocus
            />
            <p style={styles.hint}>3+ characters, no spaces</p>
          </div>

          {/* First Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your first name"
              style={styles.input}
            />
          </div>

          {/* Last Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your last name"
              style={styles.input}
            />
          </div>

          {/* Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: isLoading || !username.trim() ? 0.5 : 1,
                cursor: isLoading || !username.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'Setting up...' : 'Get Started →'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isLoading}
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              Skip for now
            </button>
          </div>
        </form>

        <div style={styles.persistCallout}>
          Your saves, vibes, and picks are stored to your account — they'll be here every time you come back.
        </div>

        <p style={styles.footer}>
          You can update these anytime in your profile settings
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#fafafa',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '12px',
    color: '#000',
    margin: '0 0 12px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '32px',
    margin: '0 0 32px 0',
  },
  errorBox: {
    padding: '12px 16px',
    marginBottom: '24px',
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    color: '#c33',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#c33',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border 0.2s ease',
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px',
  },
  button: {
    padding: '14px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  primaryButton: {
    backgroundColor: '#000',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    color: '#666',
    border: '1px solid #ddd',
  },
  persistCallout: {
    marginTop: '24px',
    padding: '12px 16px',
    backgroundColor: '#f0faf4',
    border: '1px solid #b6e8c8',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#2d6a4a',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  footer: {
    fontSize: '12px',
    color: '#999',
    textAlign: 'center',
    marginTop: '12px',
    margin: '12px 0 0 0',
  },
};
