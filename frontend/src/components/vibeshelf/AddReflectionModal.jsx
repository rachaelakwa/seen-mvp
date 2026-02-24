import React, { useState } from 'react';
import { MOOD_OPTIONS, EMOTION_TAGS } from '../../data/reflectionOptions';
import './vibeshelf.css';

export default function AddReflectionModal({ isOpen, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState([]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title: title.trim(),
        mood,
        note: note.trim(),
        emotions: selectedEmotions,
      });
      // Reset form
      setTitle('');
      setMood('');
      setNote('');
      setSelectedEmotions([]);
    }
  };

  const toggleEmotion = (label) => {
    setSelectedEmotions(prev =>
      prev.includes(label)
        ? prev.filter(e => e !== label)
        : [...prev, label]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="reflection-modal-overlay">
      <div className="reflection-modal-content">
        <div className="reflection-modal-header">
          <h2 className="reflection-modal-title">
            Add Reflection
          </h2>
          <button
            onClick={onClose}
            className="reflection-modal-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="reflection-modal-field">
          <label className="reflection-modal-label">
            What did you watch?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The Bear, Midnight Diner..."
            className="reflection-modal-input"
          />
        </div>

        <div className="reflection-modal-field">
          <label className="reflection-modal-label">
            What mood were you in?
          </label>
          <div className="reflection-modal-chip-group">
            {MOOD_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => setMood(mood === option ? '' : option)}
                className="reflection-modal-mood-chip"
                style={{
                  background: mood === option ? '#e74c3c' : '#f0f0f0',
                  color: mood === option ? '#fff' : '#666',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="reflection-modal-field">
          <label className="reflection-modal-label">
            How did it make you feel?
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Share your thoughts... What did this show help you feel or process?"
            className="reflection-modal-textarea"
          />
        </div>

        <p className="reflection-modal-hint">
          Be honest and reflective. This is your personal space.
        </p>

        <div className="reflection-modal-field">
          <label className="reflection-modal-label reflection-modal-label--lg-gap">
            Tag your emotions
          </label>
          <div className="reflection-modal-chip-group">
            {EMOTION_TAGS.map(emotion => (
              <button
                key={emotion.label}
                onClick={() => toggleEmotion(emotion.label)}
                className="reflection-modal-emotion-chip"
                style={{
                  border: selectedEmotions.includes(emotion.label) ? '2px solid #000' : '1px solid #e0e0e0',
                  background: selectedEmotions.includes(emotion.label) ? '#f5f5f5' : '#fff',
                }}
              >
                <span className="reflection-modal-emotion-emoji">{emotion.emoji}</span>
                {emotion.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reflection-modal-actions">
          <button
            onClick={onClose}
            className="reflection-modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="reflection-modal-save-btn"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
}
