let uihelper = {
    token: '',
    authredirect: ''
};

const UIHelperReducer = (state = uihelper, action) => {
    switch (action.type) {
        case 'TOKEN' :
            return {
                ...state,
                token: action.token
            };

        case 'AUTH_REDIRECT' :
            return {
                ...state,
                authredirect: action.url
            };

        default :
            return state
    }
};

export default UIHelperReducer;

