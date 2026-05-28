import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers';
import { connectRouter, routerMiddleware } from 'connected-react-router'
import history from './history'
import rootSaga from '../App/rootSagas';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(combineReducers({
  ...reducers,
  router: connectRouter(history)
}),
composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history))));

sagaMiddleware.run(rootSaga);

export default store
