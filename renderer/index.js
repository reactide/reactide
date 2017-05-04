import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { addTab, toggleActiveTab, closeTab } from './actions';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));

store.subscribe(() => {
  console.log('store: ', store.getState());
});

store.dispatch(addTab('filexxx'));
store.dispatch(addTab('filexxx2'));
store.dispatch(addTab('filexxx3'));
store.dispatch(addTab('filexxx4'));
store.dispatch(addTab('filexxx5'));
store.dispatch(toggleActiveTab(3));
store.dispatch(closeTab(2));
