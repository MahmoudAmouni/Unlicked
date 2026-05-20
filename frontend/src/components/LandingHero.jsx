import React, { useState, useEffect } from 'react';
import { FiHeart, FiZap } from 'react-icons/fi';
import styles from './LandingHero.module.css';

const SIMULATOR_POSTS = [
  { id: 1, color: 'linear-gradient(135deg, #FF512F, #DD2476)', title: 'Digital Art #01' },
  { id: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)', title: 'Neon Dream #02' },
  { id: 3, color: 'linear-gradient(135deg, #11998e, #38ef7d)', title: 'Forest Flow #03' },
  { id: 4, color: 'linear-gradient(135deg, #F56040, #5B86E5)', title: 'Summer Wave #04' },
  { id: 5, color: 'linear-gradient(135deg, #F0C27B, #4B1248)', title: 'Velvet Sunset #05' },
  { id: 6, color: 'linear-gradient(135deg, #00c6ff, #0072ff)', title: 'Blue Shift #06' }
];

export function LandingHero({ onLaunch }) {
  const [posts, setPosts] = useState(SIMULATOR_POSTS.map(p => ({ ...p, status: 'liked' })));
  const [unlikedCount, setUnlikedCount] = useState(38);
  const [sessionCount, setSessionCount] = useState(12);

  useEffect(() => {
    let timeoutId;
    let currentIdx = 0;

    const runSimulation = () => {
      const likedIndex = posts.findIndex((p, idx) => idx >= currentIdx && p.status === 'liked');
      
      if (likedIndex !== -1) {
        setPosts(prev => prev.map((p, idx) => idx === likedIndex ? { ...p, status: 'unliking' } : p));
        
        timeoutId = setTimeout(() => {
          setPosts(prev => prev.map((p, idx) => idx === likedIndex ? { ...p, status: 'unliked' } : p));
          setUnlikedCount(c => c + 1);
          setSessionCount(s => s + 1);
          
          currentIdx = likedIndex + 1;
          timeoutId = setTimeout(runSimulation, 2200);
        }, 600);
      } else {
        timeoutId = setTimeout(() => {
          setPosts(SIMULATOR_POSTS.map(p => ({ ...p, status: 'liked' })));
          setSessionCount(0);
          currentIdx = 0;
          timeoutId = setTimeout(runSimulation, 1500);
        }, 4000);
      }
    };

    timeoutId = setTimeout(runSimulation, 2000);

    return () => clearTimeout(timeoutId);
  }, [posts]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} /> Safe & Private Local Automator
        </div>
        <h1 className={styles.title}>
          Take Back Your <br />
          <span className={styles.titleHighlight}>Digital Footprint</span>
        </h1>
        <p className={styles.subtitle}>
          Bulk-unlike thousands of Instagram posts safely. Avoid account flags with modern, randomized human-like patterns, full cookie persistence, and complete visual control.
        </p>
        <div className={styles.heroActions}>
          <button className={styles.primaryBtn} onClick={onLaunch}>
            Get Started Free
          </button>
          <button 
            className={styles.secondaryBtn} 
            onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>
      </div>

      <div className={styles.simulator}>
        <div className={styles.simHeader}>
          <div className={styles.simTitle}>
            <span className={styles.badgeDot} style={{ background: '#22c55e', width: 8, height: 8 }} /> Simulation Mode
          </div>
          <div className={styles.simStats}>
            <div>Total: <span className={styles.simStatVal}>{unlikedCount}</span></div>
            <div>Session: <span className={styles.simStatVal}>{sessionCount}</span></div>
          </div>
        </div>
        
        <div className={styles.simGrid}>
          {posts.map(post => (
            <div 
              key={post.id} 
              className={`${styles.simPost} ${post.status === 'unliked' ? styles.simPostUnliked : ''}`}
              style={{ background: post.color }}
            >
              {post.status === 'liked' && (
                <FiHeart className={styles.heartOverlay} fill="currentColor" />
              )}
              {post.status === 'unliking' && (
                <FiHeart className={`${styles.heartOverlay} ${styles.heartOverlayUnliking}`} fill="currentColor" />
              )}
              {post.status === 'unliked' && (
                <FiHeart className={`${styles.heartOverlay} ${styles.heartOverlayUnliked}`} fill="none" />
              )}
            </div>
          ))}
        </div>

        <div className={styles.simBanner}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiZap /> Simulating human-like action...
          </span>
          <span>+1 unliked</span>
        </div>
      </div>
    </section>
  );
}
