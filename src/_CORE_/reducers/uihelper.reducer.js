let uihelper = {
    token: ''
};

const UIHelperReducer = (state = uihelper, action) => {
    switch (action.type) {
        case 'TOKEN' :
            return {
                ...state,
                token: action.token
            };

        default :
            return {}
    }
};

export default UIHelperReducer;

