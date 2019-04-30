let user = {
    user: null,
    invited_user: null,
    user_plan: 'free_plan'
};

const UserReducer = (state=user, action) => {
    switch (action.type) {
        case 'USER' :
            return {
                ...state,
                user: action.user
            };

        case 'INVITED_USER' :
            return {
                ...state,
                invited_user: action.user
            };

        case 'USER_PLAN' :
            return {
                ...state,
                user_plan: action.plan
            };

        default :
            return state
    }
};

export { UserReducer }