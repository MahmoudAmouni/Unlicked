import React, { useState } from 'react';
import { FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from './LoginScreen.module.css';

export function LoginScreen({ onStart, isLoading, onBack }) {
  const [username, setUsername] = useState('web.craft_');
  const [password, setPassword] = useState('70380956');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onStart(username, password);
    }
  };

  return (
    <div className={styles.container}>
      <button type="button" onClick={onBack} className={styles.backButton} disabled={isLoading}>
        <FiArrowLeft className={styles.backIcon} /> Back to Home
      </button>

      <div className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Unliked Logo" className={styles.logoImg} />
          <h1 className={styles.title}>
            Unliked
          </h1>
        </div>
        <p className={styles.subtitle}>Sign in to start automating</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            placeholder="your_username"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••••••"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.toggleButton}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !username || !password}
        >
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.spinner} />
              <span>Connecting...</span>
            </div>
          ) : (
            "Start Unliking"
          )}
        </button>
      </form>

      <div className={styles.footer}>
        <p className={styles.disclaimer}>
          <FiAlertCircle className={styles.alertIcon} /> Your password is never stored on disk. It is only held in memory while the automation runs. Use at your own risk.
        </p>
      </div>
    </div>
  );
}
