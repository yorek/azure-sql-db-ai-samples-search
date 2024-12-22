import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import SearchPage from './SearchPage';
import AboutPage from './AboutPage'; 
import EditSessionPage from './EditSessionPage';

import './assets/styles/global.css'; // Global styles (optional)

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <FluentProvider theme={webLightTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/edit-session/:sessionId" element={<EditSessionPage />} />
      </Routes>
    </BrowserRouter>
  </FluentProvider>
);
