import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';

// const test = '100';

// function reducers(state = test, action) {
//   return state;
// }

// const store = createStore(
//   reducers,
//   window.__REDUX_DEVTOOLS_EXTTENSION__ &&
//     window.__REDUX_DEVTOOLS_EXTTENSION__(),
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  // </React.StrictMode>,
);
