const URLS_ = {
    root_ : 'https://dev.smoothflow.io/account',
    base_ : 'https://ytr9muk1qj.execute-api.us-east-1.amazonaws.com',
    user_ : 'https://6vxjvtmgf1.execute-api.us-east-1.amazonaws.com',
    user: {
        get_user_by_email: '/Prod/DBF/API/1.0.0.0/UserByEmail/',
        get_myself : '/Prod/DBF/API/1.0.0.0/me'
    },
    workspaces: {
        get_all: '/Prod/workspaces',
        create: '/Prod/workspace',
        ready_workspace: 'https://useracountmanagerdev.plus.smoothflow.io/DBF/API/1.0.0.0/setup/useraccount',
        get_permissions : 'https://useracountmanagerdev.plus.smoothflow.io/DBF/API/1.0.0.0/user/permissions'
    },
    subscription: {
        // base_ : 'https://zze6f4st56.execute-api.us-east-1.amazonaws.com/Prod/',
        base_ : 'https://devpayment.plus.smoothflow.io/',
        validate: 'validateAccount/',
        create_account: 'createAccount',
        create_account_free: 'createAccountWithFreeSubscription',
        subscribe_plan: 'createSubscriptionUsingToken',
        get_account_by_accode: 'getSubscriptionDetailsByAccountCode/',
    }
};

export default URLS_;