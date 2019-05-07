import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
// To federated sign in from Google
class SignInWithGoogle extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
    }

    componentDidMount() {
        const ga = window.gapi && window.gapi.auth2 ?
            window.gapi.auth2.getAuthInstance() :
            null;
        if (!ga) this.createScript();
    }

    // signIn() {
    //     const ga = window.gapi.auth2.getAuthInstance();
    //     ga.signIn().then(
    //         googleUser => {
    //             this.getAWSCredentials(googleUser);
    //         },
    //         error => {
    //             console.log(error);
    //         }
    //     );
    // }
    signIn() {
        let url = null;
        if (window.location.hostname == "localhost" ||
            window.location.hostname == "dev.smoothflow.io" ||
            window.location.hostname == "smoothflow-dev.s3-website-us-east-1.amazonaws.com" ||
            window.location.hostname == "d35ie0dhlww2mo.cloudfront.net") {
            url = 'https://smoothflow-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=https://dev.smoothflow.io/account&response_type=token&client_id=258mhpb6n41pp6s3n7v6q24tk1&identity_provider=Google';
        } else if (window.location.hostname == "smoothflow.io" ||
            window.location.hostname == "prod.smoothflow.io" ||
            window.location.hostname == "d3ored5mvntnxi.cloudfront.net") {
            url = 'https://smoothflow-prod.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=https://smoothflow.io/account&response_type=token&client_id=535313902488-549ejqd0j9rahppgvvusbnvil4b6chkh.apps.googleusercontent.com&identity_provider=Google';
        }
        window.location = url;
        // window.location = 'https://smoothflow-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize?redirect_uri=http://localhost&response_type=token&client_id=258mhpb6n41pp6s3n7v6q24tk1&identity_provider=Google';
    }

    async getAWSCredentials(googleUser) {
        debugger;
        const { id_token, expires_at } = googleUser.getAuthResponse();
        const profile = googleUser.getBasicProfile();
        let user = {
            email: profile.getEmail(),
            given_name: profile.getGivenName(),
            family_name: profile.getFamilyName()
        };

         Auth.federatedSignIn(
            'google',
            { token: id_token, expires_at },
            user
        ).then(res => {
            debugger;
        })
         .catch(res => {
             debugger
         });
    }

    createScript() {
        // load the Google SDK
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.onload = this.initGapi;
        document.body.appendChild(script);
    }

    initGapi() {
        // init the Google SDK client
        const g = window.gapi;
        g.load('auth2', function() {
            g.auth2.init({
                client_id: '535313902488-f48de8n9duk0bs8bcfkh6ooij0u1ck1e.apps.googleusercontent.com',
                // authorized scopes
                scope: 'profile email openid'
            });
        });
    }

    render() {
        return (
            <div>
                <button className="sf-button sf-button-block sf-button-google" onClick={this.signIn}>
                    <img src={require('./btn_google_light_normal_ios.svg')} alt="Google"/> Sign in with Google
                </button>
            </div>
        );
    }
}

export default SignInWithGoogle;