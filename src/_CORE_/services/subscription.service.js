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
    subscribePlan: (info) => {
        return axios({
            method: 'POST',
            url : URLs.subscription.base_ + URLs.subscription.subscribe_plan,
            data : info
        })
    }
};

export { SubscriptionService };