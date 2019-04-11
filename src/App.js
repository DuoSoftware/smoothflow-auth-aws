import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import SignUpView from './_VIEWS_/sf-signup/sf-signup.view'
import SignInView from './_VIEWS_/sf-signin/sf-signin.view'
import InvitedSignUpView from './_VIEWS_/sf-signup-invited/sf-signup-invited.view'
import CustomerComplaints from './_VIEWS_/customer-complaints-template'
import ForgotPasswordView from './_VIEWS_/sf-forgotpassword/sf-forgotpword.view'
import WorkspaceView from './_VIEWS_/sf-new-workspace/sf-new-workspace.view'
import './App.scss';
import ReduxToastr from 'react-redux-toastr'
import awsweb from "./config/aws-amplify-config";
import {CognitoAuth} from "amazon-cognito-auth-js";
import {Auth, Hub} from "aws-amplify/lib/index";
import axios from "axios";
import {User} from "./_CORE_/actions";
import { createHashHistory } from 'history'
import { connect } from 'react-redux'
import URLS_ from './_CORE_/_urls_';

class App extends Component {
    constructor(props) {
        super(props);
    };
    componentDidMount() {
        const _self = this;
        const params = {
            ClientId: awsweb.Auth.userPoolWebClientId,
            UserPoolId: awsweb.Auth.userPoolId,
            AppWebDomain: awsweb.Auth.appWebDomain,
            TokenScopesArray: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
            RedirectUriSignIn: URLS_.root_,
            RedirectUriSignOut: URLS_.root_
            // ResponseType: 'code',
            // IdentityProvider : 'Google'
        };
        const cognitoAuthClient = new CognitoAuth(params);

        // const oauth = {
        //     domain : 'smoothflow-dev.auth.us-east-1.amazoncognito.com',
        //     scope: ['email', 'profile', 'openid'],
        //     redirectSignIn: 'https://dev.smoothflow.io/account/',
        //     redirectSignOut: 'https://dev.smoothflow.io/account/',
        //     responseType: 'code' // or token
        // };

        // Auth.configure({ oauth });
        // Hub.listen('auth', (data) => {
        //     debugger;
        // });

        cognitoAuthClient.userhandler = {
            // user signed in
            onSuccess: (result) => {
                Auth.currentSession().then((session) => {
                    _self.forwardFederatedUser(session);
                })
                .catch((err) => {
                    debugger
                });
            },
            onFailure: (err) => {
                debugger
            }
        };

        const curUrl = window.location.href;
        if (curUrl.indexOf('access_token') > -1) {
            const shorten = curUrl.replace(params.RedirectUriSignIn+'/#/', params.RedirectUriSignIn+'/#');
            cognitoAuthClient.parseCognitoWebResponse(shorten);
        }
    }
    forwardFederatedUser(session) {
        axios.defaults.headers.common['Authorization'] = 'bearer ' + session.idToken.jwtToken;
        axios.defaults.headers.common['companyInfo'] = '5:1';
        this.props.dispatch(User(session.idToken));
        window.location.href = `URLS_.root_${'/#/workspaces'}`;
    }

  render() {
    return (
        <Router>
            <div className="sf-auth">
                <div className="sf-auth-header">
                    <img src="https://smoothflow.io/images/logo-smoothflow-beta-purple.svg" alt=""/>
                </div>
                <Route render={({location}) => (
                    <TransitionGroup>
                        <CSSTransition
                            key={location.key}
                            timeout={300}
                            classNames='sf-fade'>
                            <Switch location={location}>
                                <Route exact path="/" component={ SignInView }/>
                                <Route exact path="/signin" component={ SignInView }/>
                                <Route exact path="/signup" component={ SignUpView }/>
                                {/*<Route exact path="/customerComplaints" component={ CustomerComplaints }/>*/}
                                <Route exact path="/forgotpassword" component={ ForgotPasswordView }/>
                                <Route exact path="/workspaces" component={ WorkspaceView }/>
                                <Route exact path="/invitedsignup" component={ InvitedSignUpView }/>
                            </Switch>
                        </CSSTransition>
                    </TransitionGroup>
                )}/>
                <ReduxToastr
                    timeOut={4000}
                    newestOnTop={false}
                    preventDuplicates
                    position="top-right"
                    transitionIn="fadeIn"
                    transitionOut="fadeOut"
                    closeOnToastrClick/>
            </div>
        </Router>
    );
  }
}

const history = createHashHistory();
export default (connect())(App);
