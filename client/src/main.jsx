import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import SearchPage from './SearchPage';
import AboutPage from './AboutPage';
import SamplesPage from "./SamplesPage";

import './assets/styles/global.css'; 
import styles from './assets/styles/main.module.css'; 

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <div className={styles.appContainer}>
    <FluentProvider theme={webLightTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/samples" element={<SamplesPage />} />
        </Routes>
      </BrowserRouter>
    </FluentProvider>
  </div>
);
