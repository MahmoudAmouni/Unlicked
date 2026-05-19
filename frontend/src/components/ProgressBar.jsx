import React from 'react';
import styles from './ProgressBar.module.css';

export function ProgressBar({ total, session }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>Total Unliked</p>
          <h2 className={styles.totalValue}>{total.toLocaleString()}</h2>
        </div>
        <div>
          <p className={styles.sessionLabel}>This Session</p>
          <p className={styles.sessionValue}>{session}</p>
        </div>
      </div>
      
      <div className={styles.track}>
        <div 
          className={styles.bar}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
