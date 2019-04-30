import axios from 'axios';
import URLs from '../_urls_'

const SubscriptionService = {
    validateUser: (user) => {
        return axios.get(URLs.subscription.validate + user)
    },
    createAccount: (info) => {
        return axios({
            method: 'POST',
            url : URLs.subscription.base_ + URLs.subscription.create_account,
            data : info
        })
    },
    createFreeAccount: (info) => {
        return axios({
            method: 'POST',
            url : URLs.subscription.base_ + URLs.subscription.create_account_free,
            data : info
        })
    },
    getAccount: (code) => {
        return axios({
            method: 'GET',
            url : URLs.subscription.base_ + URLs.subscription.get_account_by_accode + code
        })
    },
    subscribePlan: (info) => {
        return axios({
            method: 'POST',
            url : URLs.subscription.base_ + URLs.subscription.subscribe_plan,
            data : info
        })
    }
};

export { SubscriptionService };