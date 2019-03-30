import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import SignUpView from './_VIEWS_/sf-signup/sf-signup.view'
import SignInView from './_VIEWS_/sf-signin/sf-signin.view'
import CustomerComplaints from './_VIEWS_/customer-complaints-template'
import ForgotPasswordView from './_VIEWS_/sf-forgotpassword/sf-forgotpword.view'
import WorkspaceView from './_VIEWS_/sf-new-workspace/sf-new-workspace.view'
import './App.scss';
import ReduxToastr from 'react-redux-toastr'
import awsweb from "./config/aws-amplify-config";
import {CognitoAuth} from "amazon-cognito-auth-js";
import {Auth} from "aws-amplify/lib/index";

class App extends Component {
    componentDidMount() {
        // if (!window.FB) this.createScript();
        const params = {
            ClientId: awsweb.Auth.userPoolWebClientId,
            UserPoolId: awsweb.Auth.userPoolId,
            AppWebDomain: awsweb.Auth.appWebDomain,
            TokenScopesArray: ['email', 'openid'],
            RedirectUriSignIn: 'http://dev.smoothflow.io',
            RedirectUriSignOut: 'http://dev.smoothflow.io',
            ResponseType: 'code',
            IdentityProvider : 'Google'
        };
        const cognitoAuthClient = new CognitoAuth(params);
        cognitoAuthClient.userhandler = {
            // user signed in
            onSuccess: (result) => {
                Auth.currentSession().then((session) => {
                    debugger
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
            const shorten = curUrl.replace('http://localhost:3000/#/', 'http://localhost:3000/#');
            cognitoAuthClient.parseCognitoWebResponse(shorten);
        }
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

export default App;
