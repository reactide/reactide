import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './store';

import './assets/styles.css';

const initialState = {};
const store = configureStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));