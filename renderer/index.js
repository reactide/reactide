import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { reducer } from './redux/reducers';
import App from './components/App.jsx';
import configureStore from './redux/store';

const initialState = {};
const store = configureStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));