import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App.jsx';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));
