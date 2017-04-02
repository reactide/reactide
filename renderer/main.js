import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App.jsx';
import configureStore from './redux/store';

import './assets/styles.css';

const initialState = {};
const store = configureStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));