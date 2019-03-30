let user = {
    user: null
};

const UserReducer = (state=user, action) => {
    switch (action.type) {
        case 'USER' :
            return {
                ...state,
                user: action.user
            };

        default :
            return state
    }
};

export { UserReducer }