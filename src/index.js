import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import rootReducer from './_CORE_/reducers'
import { createStore } from 'redux'
import Amplify from 'aws-amplify';
import awsweb from './config/aws-amplify-config'
import axios from 'axios'
import URLS_ from './_CORE_/_urls_'

const is_scoped = localStorage.getItem('scopes');
// if (is_scoped) window.location.href='/account/app';

const store = createStore(rootReducer);
Amplify.configure(awsweb);

// HTTP config ----------------------------------------------------//
axios.defaults.baseURL = URLS_.base_;
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + _token;
// END - HTTP config ----------------------------------------------//

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
