import React from 'react';
import styles from './assets/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1>About This App</h1>
      <p>This is an AI-powered search application built with Azure SQL and Fluent UI.</p>
      <p>Navigate back to the <a href="/">Home</a> page to perform a search.</p>
    </div>
  );
};

export default AboutPage;
