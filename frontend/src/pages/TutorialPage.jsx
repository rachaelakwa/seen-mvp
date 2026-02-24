import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './tutorial.css';

export default function TutorialPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Seen! 👋',
      description: 'Your streaming companion for discovering and sharing shows & movies with friends.',
      image: '🎬',
      highlight: null,
    },
    {
      title: 'Mood',
      description: 'Browse shows and movies organized by your mood. Whether you\'re feeling cozy, chaotic, or locked in – find something perfect for right now.',
      image: '🎯',
      highlight: null,
    },
    {
      title: 'Circles',
      description: 'Connect with friends and share recommendations. See what your friends are watching and send them your favorite shows.',
      image: '👥',
      highlight: null,
    },
    {
      title: 'Vibe Shelf',
      description: 'Your personal collection. Save shows and movies you love or want to watch later. Build your own entertainment library.',
      image: '📚',
      highlight: null,
    },
    {
      title: 'Profile',
      description: 'Manage your account, update your username, change password, and complete your profile information.',
      image: '👤',
      highlight: null,
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/mood');
    }
  };

  const handleSkip = () => {
    navigate('/mood');
  };

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="tutorial-container">
      {/* Background */}
      <div className="tutorial-background">
        <div className="tutorial-bg-1"></div>
        <div className="tutorial-bg-2"></div>
      </div>

      {/* Card */}
      <div className="tutorial-card">
        {/* Progress Bar */}
        <div className="tutorial-progress-container">
          <div className="tutorial-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="tutorial-close-btn"
          title="Skip tutorial"
        >
          ✕
        </button>

        {/* Content */}
        <div className="tutorial-content">
          {/* Image/Icon */}
          <div className="tutorial-image-container">
            <div className="tutorial-image">{currentStep.image}</div>
          </div>

          {/* Title */}
          <h1 className="tutorial-title">{currentStep.title}</h1>

          {/* Description */}
          <p className="tutorial-description">{currentStep.description}</p>

          {/* Step Indicator */}
          <div className="tutorial-step-indicator">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className="tutorial-dot"
                style={{ backgroundColor: idx <= step ? '#000' : '#e0e0e0' }}
              ></div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="tutorial-button-container">
          <button
            onClick={handleNext}
            className="tutorial-next-btn"
          >
            {step === steps.length - 1 ? 'Get Started →' : 'Next →'}
          </button>
          <button
            onClick={handleSkip}
            className="tutorial-skip-btn"
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
