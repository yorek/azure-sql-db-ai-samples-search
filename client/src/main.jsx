import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import SearchApp from './SearchPage';
import AboutPage from './AboutPage'; 
import './assets/styles/global.css'; // Global styles (optional)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FluentProvider theme={webLightTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchApp />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </FluentProvider>
);
