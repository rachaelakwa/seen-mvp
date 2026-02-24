import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './landing.css';

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );
    requestAnimationFrame(() => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', ...props }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className={`reveal landing-section-card ${className}`} {...props}>
      {children}
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">seen</Link>
          <div className="landing-nav-links">
            <a href="#how-it-works" className="landing-nav-link">How It Works</a>
            <Link to="/login" className="landing-nav-link">Sign In</Link>
            <Link to="/signup" className="landing-btn-primary landing-btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-content">
            <span className="landing-pill">Mood-first streaming companion</span>
            <h1 className="landing-hero-title">
              Inside Out meets<br />your streaming queue
            </h1>
            <p className="landing-hero-subtitle">
              Seen helps you choose what to watch based on how you feel.
              Calmly, quickly, and without the endless scroll.
            </p>
            <div className="landing-hero-cta">
              <Link to="/signup" className="landing-btn-primary landing-btn-coral landing-btn-lg">
                Start Watching with Intention
              </Link>
              <a href="#how-it-works" className="landing-btn-ghost landing-btn-lg">
                See How It Works
              </a>
            </div>
          </div>
          <div className="landing-hero-visual">
            <img
              src="/inside-out.png"
              alt="Inside Out characters representing emotions"
              className="landing-hero-img"
            />
            <img
              src="/streaming-apps.png"
              alt="Stack of streaming app icons"
              className="landing-hero-img"
            />
          </div>
        </div>
      </header>

      {/* Problem (dark brown) */}
      <RevealSection className="landing-problem">
        <div className="landing-section-inner">
          <span className="landing-section-tag">The Problem</span>
          <h2 className="landing-section-title">
            Streaming shouldn't feel like a chore
          </h2>
          <p className="landing-section-desc">
            Gen Z spends more time deciding what to watch than actually watching.
            The result? Emotional fatigue, endless scrolling, and giving up entirely.
          </p>
          <div className="landing-stats-grid stagger-children">
            <div className="landing-stat-card">
              <span className="landing-stat-number">110+</span>
              <span className="landing-stat-label">
                hours per year spent just browsing menus
              </span>
            </div>
            <div className="landing-stat-card">
              <span className="landing-stat-number">1 in 5</span>
              <span className="landing-stat-label">
                viewers abandon a session within 10 minutes
              </span>
            </div>
            <div className="landing-stat-card">
              <span className="landing-stat-number">70%</span>
              <span className="landing-stat-label">
                of Gen Z leave apps for recs on TikTok or Instagram
              </span>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Gap (sage green) */}
      <RevealSection className="landing-gap">
        <div className="landing-section-inner">
          <div className="landing-gap-grid">
            <div className="landing-gap-column">
              <h3 className="landing-gap-heading">Content-first tools</h3>
              <p className="landing-gap-text">
                Netflix, Hulu, JustWatch, Letterboxd. They help you find content,
                but miss how you feel.
              </p>
              <div className="landing-gap-tags">
                <span className="gap-tag">Netflix</span>
                <span className="gap-tag">Hulu</span>
                <span className="gap-tag">JustWatch</span>
                <span className="gap-tag">Letterboxd</span>
              </div>
            </div>
            <div className="landing-gap-bridge">
              <div className="landing-gap-bridge-circle">
                <span className="bridge-logo">seen</span>
              </div>
              <p className="bridge-caption">Bridges the gap</p>
            </div>
            <div className="landing-gap-column">
              <h3 className="landing-gap-heading">Mood-first tools</h3>
              <p className="landing-gap-text">
                Spotify Moods, Daylio, Endel. They understand emotion,
                but can't help you pick a show.
              </p>
              <div className="landing-gap-tags">
                <span className="gap-tag">Spotify</span>
                <span className="gap-tag">Daylio</span>
                <span className="gap-tag">Endel</span>
                <span className="gap-tag">Pinterest</span>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* How It Works (cream) */}
      <RevealSection className="landing-how" id="how-it-works">
        <div className="landing-section-inner">
          <span className="landing-section-tag">How It Works</span>
          <h2 className="landing-section-title">
            From mood to movie in under a minute
          </h2>
          <div className="landing-steps-grid stagger-children">
            <div className="landing-step-card">
              <div className="landing-step-num">01</div>
              <h3 className="landing-step-title">Name your mood</h3>
              <p className="landing-step-text">
                Choose from natural emotional vocabulary like "fried," "drained,"
                or "need comfort" instead of generic genres.
              </p>
            </div>
            <div className="landing-step-card">
              <div className="landing-step-num">02</div>
              <h3 className="landing-step-title">Get curated picks</h3>
              <p className="landing-step-text">
                Receive 3 to 5 emotionally matched recommendations. No infinite
                scrolling, just what fits right now.
              </p>
            </div>
            <div className="landing-step-card">
              <div className="landing-step-num">03</div>
              <h3 className="landing-step-title">Trust your circle</h3>
              <p className="landing-step-text">
                See short, honest micro-notes from friends you actually trust,
                not algorithms or strangers.
              </p>
            </div>
            <div className="landing-step-card">
              <div className="landing-step-num">04</div>
              <h3 className="landing-step-title">Save to your Vibeshelf</h3>
              <p className="landing-step-text">
                Organize shows by vibe like "Cozy Nights" or "Reset Mode" and
                track what actually restores your mood.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Features (dark brown) */}
      <RevealSection className="landing-features">
        <div className="landing-section-inner">
          <span className="landing-section-tag">Core Features</span>
          <h2 className="landing-section-title">
            Built around how you actually decide
          </h2>
          <div className="landing-features-grid stagger-children">
            <div className="landing-feature-card feature-mood">
              <div className="landing-feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="landing-feature-title">Mood-First Discovery</h3>
              <p className="landing-feature-text">
                Start with how you feel, not what's trending. Seen uses natural
                emotional language drawn from real user vocabulary to surface
                content that matches your energy.
              </p>
            </div>
            <div className="landing-feature-card feature-circles">
              <div className="landing-feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="landing-feature-title">Peer Circles</h3>
              <p className="landing-feature-text">
                Short, vibe-based micro-notes from your close friends.
                No public feeds or follower counts. Just honest, human
                signals from people whose taste you trust.
              </p>
            </div>
            <div className="landing-feature-card feature-shelf">
              <div className="landing-feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="12" y1="6" x2="12" y2="12" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                </svg>
              </div>
              <h3 className="landing-feature-title">Vibeshelf</h3>
              <p className="landing-feature-text">
                Save shows by emotional vibe, not just title. Create shelves
                like "Cozy Nights" or "Reset Mode" and add one-line reflections
                to remember what worked.
              </p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Testimonials (cream) */}
      <RevealSection className="landing-testimonials">
        <div className="landing-section-inner">
          <span className="landing-section-tag">What Users Say</span>
          <h2 className="landing-section-title">
            Tested with real people, shaped by real feelings
          </h2>
          <div className="landing-testimonials-grid stagger-children">
            <blockquote className="landing-quote-card">
              <p className="landing-quote-text">
                "The peer notes really felt like my friends. They grounded the
                whole experience for me and made it feel human."
              </p>
              <footer className="landing-quote-footer">
                User Testing, Round 1
              </footer>
            </blockquote>
            <blockquote className="landing-quote-card">
              <p className="landing-quote-text">
                "The flow immediately felt calm instead of stressful, even though
                I caught myself trying to scroll because three picks sometimes
                felt a bit tight."
              </p>
              <footer className="landing-quote-footer">
                User Testing, Round 1
              </footer>
            </blockquote>
            <blockquote className="landing-quote-card">
              <p className="landing-quote-text">
                "I loved the clean, minimal layout, but the mood words didn't
                fully sound like how I talk. I say 'fried,' not 'tired.'"
              </p>
              <footer className="landing-quote-footer">
                User Testing, Round 1
              </footer>
            </blockquote>
          </div>
        </div>
      </RevealSection>

      {/* Final CTA (coral) */}
      <RevealSection className="landing-cta-section">
        <div className="landing-section-inner">
          <div className="landing-cta-card">
            <h2 className="landing-cta-title">Ready to feel seen?</h2>
            <p className="landing-cta-text">
              Stop scrolling. Start with how you feel.
              Your next favourite show is one mood away.
            </p>
            <Link to="/signup" className="landing-btn-primary landing-btn-white landing-btn-lg">
              Get Started, It's Free
            </Link>
          </div>
        </div>
      </RevealSection>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <span className="landing-footer-copy">
            &copy; {new Date().getFullYear()} All rights reserved. Rachael Akwa.
          </span>
        </div>
      </footer>
    </div>
  );
}
