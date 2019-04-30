export const Token = token => ({
    type: 'TOKEN',
    token
});
export const AuthRedirect = url => ({
    type: 'AUTH_REDIRECT',
    url
});
