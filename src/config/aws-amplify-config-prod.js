// LIVE config

const oauth = {
    // Domain name
    domain : 'smoothflow-prod.auth.us-east-1.amazoncognito.com',

    // Authorized scopes
    scope : ['email', 'profile', 'openid'], 

    // Callback URL
    // redirectSignIn : 'https://dev.smoothflow.io/account/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
    redirectSignIn : 'https://prod.smoothflow.io/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // Sign out URL
    // redirectSignOut : 'https://dev.smoothflow.io/account/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'
    redirectSignOut : 'https://prod.smoothflow.io/', // or 'exp://127.0.0.1:19000/--/', 'myapp://main/'

    // 'code' for Authorization code grant, 
    // 'token' for Implicit grant
    responseType: 'code',

    // optional, for Cognito hosted ui specified options
    options: {
        // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
        AdvancedSecurityDataCollectionFlag : true
    }
};
const awsweb = {
    Auth: {

        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'us-east-1:afec1095-ed36-4cc2-8f5b-ef6c37528c94',

        // REQUIRED - Amazon Cognito Region
        region: 'us-east-1',

        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: 'us-east-1',

        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'us-east-1_vhcdWMTaV',

        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '7h0k235kelpooui6etj31mcntr',

        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,

        appWebDomain: 'smoothflow-prod.auth.us-east-1.amazoncognito.com',

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        // cookieStorage: {
        //     // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //     domain: 'localhost:3000',
        //     // OPTIONAL - Cookie path
        //     path: '/',
        //     // OPTIONAL - Cookie expiration in days
        //     expires: 365,
        //     // OPTIONAL - Cookie secure flag
        //     // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //     secure: true
        // },

        // OPTIONAL - customized storage object
        // storage: new MyStorage(),

        // oauth: oauth,

        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    }
};

export default awsweb;
