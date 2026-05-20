import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './LandingFaq.module.css';

const FAQS = [
  {
    q: 'Is my Instagram password safe?',
    a: 'Absolutely. Unlike web platforms that run on external servers, this tool runs 100% locally on your computer. Your credentials are only held in your local system\'s running memory (NodeJS process) and are never written to disk or sent to any cloud server.'
  },
  {
    q: 'Will Instagram suspend or ban my account?',
    a: 'Instagram has strict anti-spam triggers. To prevent flags, our algorithm mimics human behavior. It types passwords character-by-character, uses custom randomized delays (2.0s - 4.5s) between unlikes, takes long interactive breaks every 20 actions, and limits session sizes. Using cookies skips the login phase entirely to stay safe.'
  },
  {
    q: 'Can I make it run in the background (invisibly)?',
    a: 'Yes! We just implemented a headless browser option. Simply open your `.env` file in the root folder, change `HEADLESS=false` to `HEADLESS=true`, and restart the application. The browser will run completely silently in the background.'
  },
  {
    q: 'What happens if a CAPTCHA or Verification Code appears?',
    a: 'If Instagram requests identity confirmation, the automation will instantly pause itself, sound a websocket alert, and display an on-screen warning banner. You simply solve the verification manually in the Chromium window, click "Resume" in the dashboard, and the tool will continue right where it left off.'
  }
];

export function LandingFaq() {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section id="faq-section" className={styles.faq}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <p className={styles.sectionSubtitle}>Everything you need to know about safety, automation, and privacy.</p>
      </div>

      <div className={styles.faqList}>
        {FAQS.map((faq, index) => (
          <div 
            key={index} 
            className={`${styles.faqItem} ${activeFaq === index ? styles.faqItemActive : ''}`}
          >
            <button className={styles.faqHeader} onClick={() => toggleFaq(index)}>
              <span>{faq.q}</span>
              <FiChevronDown className={`${styles.faqChevron} ${activeFaq === index ? styles.faqChevronActive : ''}`} />
            </button>
            <div className={`${styles.faqAnswer} ${activeFaq === index ? styles.faqAnswerActive : ''}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
