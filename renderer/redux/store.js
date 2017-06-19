import { createStore, combineReducers, compose } from 'redux';
import rootReducer from './reducers';
import actions from './actions/';

const actionCreators = {
  actions
};

const composeEnhancers = (() => {
  const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (process.env.NODE_ENV === 'development' && compose_) {
    return compose_({ actionCreators });
  }
  return compose;
})();

export default function configureStore(initialState) {
  const enhancer = composeEnhancers();

  return createStore(rootReducer, initialState, enhancer);
}
