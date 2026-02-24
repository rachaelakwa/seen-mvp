import React, { useContext, useState } from 'react';
import { TutorialContext } from '../context/TutorialContext';
import './TutorialPointer.css';

/**
 * TutorialPointer - Floating tooltip that guides users through app features
 * 
 * Props:
 *   - tutorialId: unique ID for this tutorial (e.g., 'mood_page_intro')
 *   - steps: array of step objects with { title, description, target? }
 *   - target: optional CSS selector for element to highlight/point to
 */
const TutorialPointer = ({ tutorialId, steps }) => {
  const { isTutorialViewed, markTutorialAsViewed } = useContext(TutorialContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Don't show if already viewed or dismissed
  if (isTutorialViewed(tutorialId) || dismissed) {
    return null;
  }

  if (!steps || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      markTutorialAsViewed(tutorialId);
      setDismissed(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    markTutorialAsViewed(tutorialId);
    setDismissed(true);
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-pointer" style={step.position || {}}>
        {/* Close button */}
        <button className="tutorial-close" onClick={handleSkip}>
          ✕
        </button>

        {/* Step indicator */}
        <div className="tutorial-indicator">
          {currentStep + 1} / {steps.length}
        </div>

        {/* Content */}
        <div className="tutorial-content">
          <h3 className="tutorial-title">{step.title}</h3>
          <p className="tutorial-description">{step.description}</p>
        </div>

        {/* Dots indicator */}
        <div className="tutorial-dots">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="tutorial-buttons">
          <button className="tutorial-skip" onClick={handleSkip}>
            Skip
          </button>
          <button className="tutorial-next" onClick={handleNext}>
            {isLastStep ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPointer;
