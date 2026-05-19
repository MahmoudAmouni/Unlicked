import React from 'react';
import { FiActivity, FiShield, FiClock, FiTerminal, FiAlertCircle } from 'react-icons/fi';
import { ProgressBar } from '../components/ProgressBar';
import { LogFeed } from '../components/LogFeed';
import { StatusBanner } from '../components/StatusBanner';
import styles from './DashboardScreen.module.css';

export function DashboardScreen({ stats, logs, onStop, isConnected }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Unliked Logo" className={styles.logoImg} />
            <h1 className={styles.title}>Unliked</h1>
          </div>
          <span className={styles.divider}>/</span>
          <span className={styles.subBrand}>Console</span>
        </div>
        
        <div className={styles.headerActions}>
          <div className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            <div className={styles.connDot} />
            <span>{isConnected ? 'LIVE FEED ACTIVE' : 'RECONNECTING...'}</span>
          </div>
          <button onClick={onStop} className={styles.stopButton}>
            Terminate Session
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <ProgressBar total={stats.unlikedTotal} session={stats.unlikedSession} />
            
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statHeader}>
                  <FiActivity className={styles.statIcon} />
                  <p className={styles.statLabel}>Status</p>
                </div>
                <div className={styles.statusWrapper}>
                  <StatusBanner status={stats.status} />
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statHeader}>
                  <FiClock className={styles.statIcon} />
                  <p className={styles.statLabel}>Session Start</p>
                </div>
                <p className={styles.statValue}>
                  {stats.startedAt ? new Date(stats.startedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'}) : 'NOT STARTED'}
                </p>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.infoCard}`}>
            <div className={styles.sectionHeader}>
              <FiShield className={styles.sectionHeaderIcon} />
              <h4 className={styles.sectionTitle}>Security & Bypass</h4>
            </div>
            
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <span>Anti-Fingerprinting Setup</span>
                <span className={styles.success}>Active & Stealth</span>
              </li>
              <li className={styles.infoItem}>
                <span>Randomized Action Timing</span>
                <span className={styles.success}>Natural human model</span>
              </li>
              <li className={styles.infoItem}>
                <span>Automated Captcha Intercept</span>
                <span className={styles.success}>Active listener</span>
              </li>
            </ul>
            
            <div className={styles.tipBox}>
              <FiAlertCircle className={styles.tipIcon} />
              <div>
                <p className={styles.tipLabel}>Proctor Tip</p>
                <p className={styles.tipText}>
                  If the automation pauses for verification, solve the capture block in the popup Chromium viewport.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={`${styles.card} ${styles.consoleCard}`}>
            <div className={styles.consoleHeader}>
              <FiTerminal className={styles.consoleHeaderIcon} />
              <span>Realtime Output</span>
            </div>
            <LogFeed logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
