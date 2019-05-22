const URLS_DEV = {
    root_ : 'https://dev.smoothflow.io/account',
    base_ : 'https://ytr9muk1qj.execute-api.us-east-1.amazonaws.com',
    user_ : 'https://ml9oskczql.execute-api.us-east-1.amazonaws.com',
    user: {
        get_user_by_email: '/Dev/DBF/API/1.0.0.0/UserByEmail/',
        get_myself : '/Dev/DBF/API/1.0.0.0/me'
    },
    workspaces: {
        base_ : 'https://hf93pu6xod.execute-api.us-east-1.amazonaws.com/Dev/',
        get_all: 'workspaces',
        create: 'Dev/workspace',
        ready_workspace: 'https://awsauthdev.plus.smoothflow.io/dbf/api/1.0.0.0/setup/useraccount',
        get_permissions : 'https://awsauthdev.plus.smoothflow.io/dbf/api/1.0.0.0/user/permissions'
    },
    subscription: {
        // base_ : 'https://zze6f4st56.execute-api.us-east-1.amazonaws.com/Prod/',
        base_ : 'https://devpayment.plus.smoothflow.io/',
        validate: 'validateAccount/',
        create_account: 'createAccount',
        create_account_free: 'createAccountWithFreeSubscription',
        subscribe_plan: 'createSubscriptionUsingToken',
        get_account_by_accode: 'getSubscriptionDetailsByAccountCode/',
    },
    maintenance: {
        base_ : 'https://dev.smoothflow.io/account/maintenance.json'
    }
};
const URLS_PROD = {
    root_ : 'https://smoothflow.io/account',
    base_ : 'https://ytr9muk1qj.execute-api.us-east-1.amazonaws.com',
    user_ : 'https://ml9oskczql.execute-api.us-east-1.amazonaws.com',
    user: {
        get_user_by_email: '/Prod/DBF/API/1.0.0.0/UserByEmail/',
        get_myself : '/Prod/DBF/API/1.0.0.0/me'
    },
    workspaces: {
        base_ : 'https://hf93pu6xod.execute-api.us-east-1.amazonaws.com/Prod/',
        get_all: 'workspaces',
        create: 'workspace',
        ready_workspace: 'https://awsauth.plus.smoothflow.io/dbf/api/1.0.0.0/setup/useraccount',
        get_permissions : 'https://awsauth.plus.smoothflow.io/dbf/api/1.0.0.0/user/permissions'
    },
    subscription: {
        // base_ : 'https://zze6f4st56.execute-api.us-east-1.amazonaws.com/Prod/',
        base_ : 'https://payment.plus.smoothflow.io/',
        validate: 'validateAccount/',
        create_account: 'createAccount',
        create_account_free: 'createAccountWithFreeSubscription',
        subscribe_plan: 'createSubscriptionUsingToken',
        get_account_by_accode: 'getSubscriptionDetailsByAccountCode/',
    },
    maintenance: {
        base_ : 'https://smoothflow.io/account/maintenance.json'
    }
};
let URLS_ = null;

if (window.location.hostname == "localhost" ||
    window.location.hostname == "dev.smoothflow.io" ||
    window.location.hostname == "smoothflow-dev.s3-website-us-east-1.amazonaws.com" ||
    window.location.hostname == "d35ie0dhlww2mo.cloudfront.net") {
    debugger
    
    URLS_ = URLS_DEV;
} else if (window.location.hostname == "smoothflow.io" ||
    window.location.hostname == "prod.smoothflow.io" ||
    window.location.hostname == "d3ored5mvntnxi.cloudfront.net") {
    debugger
    URLS_ = URLS_PROD;
}

export default URLS_;