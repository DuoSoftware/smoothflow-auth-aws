const URLS_ = {
    base_ : 'https://ytr9muk1qj.execute-api.us-east-1.amazonaws.com',
    user_ : 'https://6vxjvtmgf1.execute-api.us-east-1.amazonaws.com',
    user: {
        get_user_by_email: '/Prod/DBF/API/1.0.0.0/UserByEmail/',
        get_myself : '/Prod/DBF/API/1.0.0.0/me'
    },
    workspaces: {
        get_all: '/Prod/workspaces',
        create: '/Prod/workspace',
        ready_workspace: 'https://useracountmanagerdev.plus.smoothflow.io/dbf/v1/setup/useraccount',
        get_permissions : 'https://useracountmanagerdev.plus.smoothflow.io/dbf/v1/user/permissions'
    }
};

export default URLS_;