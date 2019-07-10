import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory as createHistory } from 'history';
import { Router } from 'react-router-dom';
import configureStore from './constants/config-store';
import { Provider } from 'react-redux';
import { LocaleProvider } from 'antd';
import viVN from 'antd/lib/locale-provider/vi_VN';
require('dotenv').config();
ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={createHistory()}>
      <LocaleProvider locale={viVN}>
        <App />
      </LocaleProvider>
    </Router>
  </Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls. Learn
// more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
