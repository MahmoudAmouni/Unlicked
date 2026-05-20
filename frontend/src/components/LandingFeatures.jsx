import React from 'react';
import { FiShield, FiClock, FiBarChart2, FiKey } from 'react-icons/fi';
import styles from './LandingFeatures.module.css';

export function LandingFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Crafted for Digital Freedom</h2>
        <p className={styles.sectionSubtitle}>
          A local cleanup app configured with anti-fingerprinting technology and designed with high aesthetic standards.
        </p>
      </div>

      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <FiShield style={{ color: '#ff6097' }} />
          </div>
          <h3 className={styles.featureName}>100% Secure & Local</h3>
          <p className={styles.featureText}>
            Runs entirely on your machine. Your username and password are never uploaded, logged, or saved to any file.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <FiClock style={{ color: '#ff6097' }} />
          </div>
          <h3 className={styles.featureName}>Advanced Anti-Detection</h3>
          <p className={styles.featureText}>
            Uses human typing speeds, randomized action delays, and regular breaks to bypass standard Instagram automation filters.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <FiBarChart2 style={{ color: '#ff6097' }} />
          </div>
          <h3 className={styles.featureName}>Real-time Dashboard</h3>
          <p className={styles.featureText}>
            Watch live action logs, active stats (average time, target limits), and current progress bar updates dynamically.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <FiKey style={{ color: '#ff6097' }} />
          </div>
          <h3 className={styles.featureName}>Cookie Reuse</h3>
          <p className={styles.featureText}>
            Loads cookies securely from disk after the first successful login, allowing you to skip login prompts entirely on future runs.
          </p>
        </div>
      </div>
    </section>
  );
}
