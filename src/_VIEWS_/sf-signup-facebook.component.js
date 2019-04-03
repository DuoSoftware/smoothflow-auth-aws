import React, { Component } from 'react'
import { Auth } from 'aws-amplify';
import { CognitoAuth } from 'amazon-cognito-auth-js'
import awsweb from '../config/aws-amplify-config'

// To federated sign in from Facebook
class SignInWithFacebook extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    // componentDidMount() {
    //     if (!window.FB) this.createScript();
    //     const params = {
    //         ClientId: awsweb.Auth.userPoolWebClientId,
    //         UserPoolId: awsweb.Auth.userPoolId,
    //         AppWebDomain: 'smoothflow-dev.auth.us-east-1.amazoncognito.com',
    //         RedirectUriSignIn: 'http://localhost:3000',
    //         ResponseType: 'token'
    //     };
    //     const cognitoAuthClient = new CognitoAuth(params);
    //     cognitoAuthClient.userhandler = {
    //         // user signed in
    //         onSuccess: (result) => {
    //             Auth.currentSession().then(async (session) => {
    //                 debugger
    //             });
    //         },
    //         onFailure: (err) => {
    //             debugger
    //         }
    //     };
    //
    //     const curUrl = window.location.href;
    //     cognitoAuthClient.parseCognitoWebResponse(curUrl);
    // }

    // signIn() {
    //     const fb = window.FB;
    //     fb.getLoginStatus(response => {
    //         if (response.status === 'connected') {
    //             this.getAWSCredentials(response.authResponse);
    //         } else {
    //             fb.login(
    //                 response => {
    //                     if (!response || !response.authResponse) {
    //                         return;
    //                     }
    //                     this.getAWSCredentials(response.authResponse);
    //                 },
    //                 {
    //                     // the authorized scopes
    //                     scope: 'public_profile,email'
    //                 }
    //             );
    //         }
    //     });
    // }

    signIn() {
        window.location = 'https://smoothflow-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=http://https://dev.smoothflow.io/account&response_type=token&client_id=258mhpb6n41pp6s3n7v6q24tk1&identity_provider=Facebook';
    }

    getAWSCredentials(response) {
        const { accessToken, expiresIn } = response;
        const date = new Date();
        const expires_at = expiresIn * 1000 + date.getTime();
        if (!accessToken) {
            return;
        }

        const fb = window.FB;
        fb.api('/me', { fields: 'name,email' }, response => {
            const user = {
                name: response.name,
                email: response.email
            };

            Auth.federatedSignIn('facebook', { token: accessToken, expires_at }, user)
                .then(credentials => {
                    console.log(credentials);
                });
        });
    }

    createScript() {
        // load the sdk
        window.fbAsyncInit = this.fbAsyncInit;
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.onload = this.initFB;
        document.body.appendChild(script);
    }

    initFB() {
        const fb = window.FB;
        console.log('FB SDK inited');
    }

    fbAsyncInit() {
        // init the fb sdk client
        const fb = window.FB;
        const loc = window.location.hostname;
        if (loc == "localhost" || loc == "dev.smoothflow.io") {
            fb.init({
                appId: '448023185723623',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.1'
            });
        } else if (loc == "smoothflow.io") {
            fb.init({
                appId: '877968375673377',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v3.1'
            });
        }
    }

    render() {
        return (
            <div>
                <button className="sf-button sf-button-block sf-button-facebook" onClick={this.signIn}>
                    <img src={require('./flogo-HexRBG-Wht-58.svg')} alt="Facebook"/> Sign in with Facebook</button>
            </div>
        );
    }
}

export default SignInWithFacebook;