import React from 'react';
import ReactDOM from 'react-dom/client';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import SearchApp from './SearchApp';
import './assets/styles/global.css'; // Global styles (optional)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <FluentProvider theme={webLightTheme}>
    <SearchApp />
  </FluentProvider>
);
