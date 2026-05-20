import React from 'react';
import { FiHeart } from 'react-icons/fi';
import styles from './LandingFooter.module.css';

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        Designed locally on your device with <FiHeart fill="currentColor" style={{ width: 14, height: 14, color: '#ff3040' }} />
      </div>
      <p className={styles.disclaimer}>
        Disclaimer: This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Instagram, Meta Platforms, Inc., or any of their subsidiaries. Use responsibly and at your own risk.
      </p>
    </footer>
  );
}
