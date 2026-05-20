import React from 'react';
import styles from './LandingHeader.module.css';

export function LandingHeader({ onLaunch }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Unliked Logo" className={styles.logoImg} />
        <span>Unliked</span>
      </div>
      <button className={styles.navBtn} onClick={onLaunch}>
        Launch App
      </button>
    </header>
  );
}
