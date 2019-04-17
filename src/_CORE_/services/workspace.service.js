import axios from 'axios'
import URLS_ from '../_urls_'

const WorkspaceService = {
    getUserByEmail: (email) => {
        return axios.get(URLS_.user_ + URLS_.user.get_user_by_email + email);
    },
    getMyself: (email) => {
        return axios.get(URLS_.user_ + URLS_.user.get_myself);
    },
    readyWorkspace: (workspaceName, sub) => {
        return axios.post(URLS_.workspaces.ready_workspace,
            {
                workspaceName: workspaceName,
                billingAccount : sub
            });
    },
    getPermissions: () => {
        return axios.get(URLS_.workspaces.get_permissions);
    },
    getAllWorkspaces: () => {
        return axios.get(URLS_.base_ + URLS_.workspaces.get_all);
    },
    createWorkspace: (data) => {
        return axios.post(URLS_.base_ + URLS_.workspaces.create, data);
    }
};

export { WorkspaceService };