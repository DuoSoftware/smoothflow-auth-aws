import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import rootReducer from './_CORE_/reducers'
import { createStore } from 'redux'
import Amplify from 'aws-amplify';
import awsweb from './config/aws-amplify-config-prod'
import awswebdev from './config/aws-amplify-config-dev'
import axios from 'axios'
import URLS_ from './_CORE_/_urls_'
import UnderMaintenance from './UnderMaintenance'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'

const is_scoped = localStorage.getItem('scopes');
if (is_scoped) window.location.href='/account/app';
let awsc = null;

const store = createStore(rootReducer);
if (window.location.hostname == "localhost" ||
    window.location.hostname == "dev.smoothflow.io" ||
    window.location.hostname == "smoothflow-dev.s3-website-us-east-1.amazonaws.com" ||
    window.location.hostname == "d35ie0dhlww2mo.cloudfront.net") {
    awsc = awswebdev;
} else if (window.location.hostname == "smoothflow.io" ||
    window.location.hostname == "prod.smoothflow.io" ||
    window.location.hostname == "d3ored5mvntnxi.cloudfront.net") {
    awsc = awsweb;
}
Amplify.configure(awsc);

axios.get(URLS_.maintenance.base_)
    .then(res => {
        debugger
        bootstrapApp(res.data.under_maintenance);

        // HTTP config ----------------------------------------------------//
        axios.defaults.baseURL = URLS_.base_;
        // axios.defaults.headers.common['Authorization'] = 'Bearer ' + _token;
        // END - HTTP config ----------------------------------------------//

    })
    .catch(eres => {
        debugger
        bootstrapApp(false);
    });

const bootstrapApp = (app) => {
    const force = window.location.href.includes('force=true');

    ReactDOM.render(
        <Provider store={store}>
            <Router>
                { app && !force ? <UnderMaintenance/> : <App /> }
            </Router>
        </Provider>
        , document.getElementById('root'));
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
