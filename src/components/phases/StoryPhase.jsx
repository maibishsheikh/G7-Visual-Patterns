// src/components/phases/StoryPhase.jsx
// Phase 2: Story — 4 Widescreen Comic Story Panels for MosaicQuest

import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

import story0 from '../../assets/story/story_0.jpg';
import story1 from '../../assets/story/story_1.jpg';
import story2 from '../../assets/story/story_2.jpg';
import story3 from '../../assets/story/story_3.jpg';

const STORY_IMAGES = [story0, story1, story2, story3];

function StoryImage({ panel }) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = STORY_IMAGES[panel.panel] || STORY_IMAGES[0];

  useEffect(() => {
    setImgError(false);
  }, [panel.panel]);

  return (
    <div className="story-image-container">
      {!imgError && imageSrc ? (
        <img
          key={panel.panel}
          src={imageSrc}
          alt={panel.title}
          onError={() => setImgError(true)}
          className="story-full-img"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          }}
        />
      ) : (
        <div
          className="story-img-fallback"
          style={{
            background: panel.imageBg,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            border: '1.5px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          <span style={{ fontSize: '3.6rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
            {panel.imageEmoji}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 900,
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {panel.title}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '280px',
            }}
          >
            {panel.highlight}
          </span>
        </div>
      )}
    </div>
  );
}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.85)',
            maxWidth: '280px',
          }}
        >
          {panel.highlight}
        </span>
      </div>
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const isLastPanel = (state?.storyPanel || 0) >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(state?.storyPanel || 0)), 300);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [state?.storyPanel, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={state?.storyPanel || 0}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${(((state?.storyPanel || 0) + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">
            {(state?.storyPanel || 0) + 1} / {totalPanels}
          </span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Illustration Frame */}
          <div className="story-image-section">
            <StoryImage panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">
                <span className="character-emoji">{panel.characterEmoji || '🧑🏽‍🎨'}</span>
              </div>
              <span className="character-name">{panel.character || 'Nadia & Arjun'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Dots + Action Buttons */}
        <div className="story-footer-nav">
          <div className="story-dots-center">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`story-nav-dot ${i === (state?.storyPanel || 0) ? 'active' : ''} ${i < (state?.storyPanel || 0) ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="story-nav-actions">
            {(state?.storyPanel || 0) > 0 && (
              <button
                type="button"
                id="story-prev-btn"
                className="btn btn-outline btn-sm story-prev-btn"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              id="story-next-btn"
              className="btn btn-primary btn-sm story-next-btn"
              onClick={handleNext}
              aria-label={isLastPanel ? 'Start Simulating' : 'Next story'}
            >
              {!isLastPanel ? 'Next →' : 'Simulate! 🧪'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
