import AppRoot from './AppRoot.component.js';
import React from 'react';
import ReactDOM from 'react-dom';

const app = {
  initialize() {
    ReactDOM.render(<AppRoot/>, document.getElementById('react-app-hook'));
  }
};

app.initialize();
