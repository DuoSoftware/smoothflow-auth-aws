import {AuthRedirect} from "../actions";

const UIHelperService = {
    parseJWT : (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    },
    validateRedirections : (dispatcher) => {
        const u = window.location.href;
        const f = '?r=';
        if (u.indexOf(f) !== -1) {
            const r = u.split(f)[1];
            dispatcher(AuthRedirect(r));
        }
    },
    getJsonFromUrl(url) {
        if(!url) url = window.location.search;
        const query = url.substr(1);
        const result = {};
        query.split("&").forEach(function(part) {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }
};

export { UIHelperService };