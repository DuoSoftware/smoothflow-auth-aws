import React, { Component } from 'react'
import { connect } from 'react-redux'
import './sf-new-workspace.scss'
import Wrap from "../../_COMPONENTS_/_common_/wrap/sf-wrap.component";
import {Preloader} from "../../_COMPONENTS_/_common_/sf-preloader/sf-preloader.component";
import {WorkspaceService, SubscriptionService, UIHelperService} from "../../_CORE_/services";
import axios from 'axios';
import {Auth} from "aws-amplify/lib/index";
import {User} from "../../_CORE_/actions";
import {toastr} from "react-redux-toastr";
import { createHashHistory } from 'history';

class WorkspaceView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFreshUser: false,
            loading: false,
            newWorkspace: {
                name: ''
            }
        };
    }

    componentDidMount() {
        const user = this.props.user.user;
        const _self = this;
        this.setState(s => ({...s, loading: true}));
        Auth.currentSession()
            .then(session => {
                // debugger
                axios.defaults.headers.common['Authorization'] = 'bearer ' + session.idToken.jwtToken;
                axios.defaults.headers.common['companyInfo'] = '5:1';
                _self.props.dispatch(User(session.idToken));
                _self.setState(s => ({...s, loading: false}));
                _self.checkWorkspace(user.payload.email);
            });
    }

    handleFormInputs = (e) => {
        const _id = e.target.id;
        const _val = e.target.value;

        switch (_id) {
            case 'workspaceName' :
                this.setState(state => ({
                    ...state,
                    newWorkspace: {
                        ...state.newWorkspace,
                        name: _val
                    }
                }));
                break;

            default:
                break;

        }
    };
    checkWorkspace(email) {
        this.setState(s => ({...s, loading: true}));
        WorkspaceService.getMyself()
            .then(user => {
                this.readyWorkspace(user.data.Result);
            })
            .catch(error => {
                this.readyWorkspace(null);
            });
    }
    readyWorkspace(user) {
        if (user && user.workspaces.length) {
            const wpn = user.workspaces[0].workspaceName;
            this.setState(s => ({
                ...s,
                newWorkspace: {
                    ...s.newWorkspace,
                    name: wpn
                }
            }));
            this.getUserPermission();

            // this.bootstrapWorkspace(null);
        } else {
            this.setState(s=>({
                ...s,
                isFreshUser: true,
                loading: false
            }));
        }
    }
    getUserPermission() {
        WorkspaceService.getPermissions()
            .then(permission => {
                if (permission.status === 200) {
                    this.bootstrapWorkspace(permission.data.data);
                }
            })
            .catch(eres => {
                debugger
            });
    }
    initiateWorkspace(e) {
        if(e) e.preventDefault();
        this.setState(s => ({...s, loading: true}));

        const userplan = this.props.user.user_plan;
        const sub = this.props.user.user.payload.sub;
        WorkspaceService.readyWorkspace(this.state.newWorkspace.name, sub, userplan)
            .then(workspace => {
                debugger
                if (workspace.status === 200) {
                    const ws = UIHelperService.parseJWT(workspace.data.data);
                    const user = {
                        firstName : this.props.user.user.payload.given_name,
                        lastName : this.props.user.user.payload.family_name,
                        email : this.props.user.user.payload.email,
                        company : ws.company.toString(),
                        tenant : this.props.user.user.payload.email
                    };
                    axios.defaults.headers.common['companyInfo'] = ws.tenant + ':' + ws.company;
                    this.createBillingAccount(user);
                }
            })
            .catch(res => {
                debugger;
                this.setState(s => ({...s, loading: false}));
            })
    }
    createBillingAccount (user, plan) {
        if (plan) {
            this.bootstrapWorkspace();
        } else {
            SubscriptionService.createFreeAccount(user)
                .then(res => {
                    // debugger
                    if (res.data.IsSuccess) {
                        this.bootstrapWorkspace();
                    } else {
                        toastr.error('Failed to create Billing Account', 'Something went wrong. Please try again later.');
                        history.push('/');
                    }
                })
                .catch(res => {
                    toastr.error('Failed to create Billing Account', 'Something went wrong. Please try again later.');
                    history.push('/');
                });
        }
    }

    // subscribeToPlan (user, token, plan) {
    //     user['token'] = token;
    //     user['planCode'] = plan;
    //     SubscriptionService.subscribePlan(user)
    //         .then(res => {
    //             // debugger
    //             if (res.data.IsSuccess) {
    //                 this.bootstrapWorkspace();
    //             } else {
    //                 toastr.error('Sign up failed', 'Something went wrong. Please try again later.');
    //                 history.push('/');
    //             }
    //         })
    //         .catch(res => {
    //             toastr.error('Sign up failed', 'Something went wrong. Please try again later.');
    //             history.push('/');
    //         });
    // }

    // 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnQiOjQ5LCJjb21wYW55IjozOSwidXNlck5hbWUiOiI1YjYxOTNhNi0yZDUxLTQyMWEtODdiMC1kZjQyZTI5ZDVjYzciLCJlbWFpbCI6ImNhZGVuY2UubWVkaGFuc2hAY293c3RvcmUub3JnIiwiYm90IjoiIiwiYm90VW5pcXVlSWQiOiIiLCJkZXNjcmlwdGlvbiI6IiIsInJvbGVzIjpbeyJyb2xlSWQiOiJhbGwiLCJyb2xlTmFtZSI6ImFsbCIsIndvcmtzcGFjZUlkIjo0OSwicHJvamVjdElkIjozOX1dLCJncm91cHMiOlt7Imdyb3VwSWQiOiJhbGwiLCJncm91cE5hbWUiOiJhbGwifV0sIndvcmtzcGFjZXMiOlt7IndvcmtzcGFjZUlkIjo0OSwid29ya3NwYWNlTmFtZSI6IkNhZGVuY2UgMSJ9XSwicHJvamVjdHMiOlt7InByb2plY3RJZCI6MzksInByb2plY3ROYW1lIjoiQ2FkZW5jZSAxJ3MgSW5pdGlhbCBQcm9qZWN0Iiwid29ya3NwYWNlSWQiOjQ5fV0sInBlcm1pc3Npb25zIjpbeyJCb3RTZXJ2aWNlIjp7IkJvdHM6QyI6dHJ1ZSwiQm90czpSIjp0cnVlLCJCb3RzOlUiOnRydWUsIkJvdHM6RCI6dHJ1ZX19LHsiQm90QXBwU2VydmljZSI6eyJCb3RzQXBwOkMiOnRydWUsIkJvdHNBcHA6UiI6dHJ1ZSwiQm90c0FwcDpVIjp0cnVlLCJCb3RzQXBwOkQiOnRydWV9fSx7IldvcmtzcGFjZVNlcnZpY2UiOnsiV29ya3NwYWNlOkMiOnRydWUsIldvcmtzcGFjZTpSIjp0cnVlLCJXb3Jrc3BhY2U6VSI6dHJ1ZSwiV29ya3NwYWNlOkQiOnRydWV9fSx7IlVzZXJTZXJ2aWNlIjp7IlVzZXI6QyI6dHJ1ZSwiVXNlcjpSIjp0cnVlLCJVc2VyOlUiOnRydWUsIlVzZXI6RCI6dHJ1ZX19LHsiUm9sZVNlcnZpY2UiOnsiUm9sZTpDIjp0cnVlLCJSb2xlOlIiOnRydWUsIlJvbGU6VSI6dHJ1ZSwiUm9sZTpEIjp0cnVlfX0seyJHcm91cFNlcnZpY2UiOnsiR3JvdXA6QyI6dHJ1ZSwiR3JvdXA6UiI6dHJ1ZSwiR3JvdXA6VSI6dHJ1ZSwiR3JvdXA6RCI6dHJ1ZX19LHsiUHJvamVjdFNlcnZpY2UiOnsiUHJvamVjdDpDIjp0cnVlLCJQcm9qZWN0OlIiOnRydWUsIlByb2plY3Q6VSI6dHJ1ZSwiUHJvamVjdDpEIjp0cnVlfX0seyJDYXJkU2VydmljZSI6eyJDYXJkOkMiOnRydWUsIkNhcmQ6UiI6dHJ1ZSwiQ2FyZDpVIjp0cnVlLCJDYXJkOkQiOnRydWV9fSx7IlF1aWNrUmVwbHlTZXJ2aWNlIjp7IlF1aWNrUmVwbHk6QyI6dHJ1ZSwiUXVpY2tSZXBseTpSIjp0cnVlLCJRdWlja1JlcGx5OlUiOnRydWUsIlF1aWNrUmVwbHk6RCI6dHJ1ZX19LHsiTWVkaWFDYXJkU2VydmljZSI6eyJNZWRpYUNhcmQ6QyI6dHJ1ZSwiTWVkaWFDYXJkOlIiOnRydWUsIk1lZGlhQ2FyZDpVIjp0cnVlLCJNZWRpYUNhcmQ6RCI6dHJ1ZX19LHsiQnV0dG9uTGlzdFNlcnZpY2UiOnsiQnV0dG9uTGlzdDpDIjp0cnVlLCJCdXR0b25MaXN0OlIiOnRydWUsIkJ1dHRvbkxpc3Q6VSI6dHJ1ZSwiQnV0dG9uTGlzdDpEIjp0cnVlfX0seyJSZWNlaXB0U2VydmljZSI6eyJSZWNlaXB0OkMiOnRydWUsIlJlY2VpcHQ6UiI6dHJ1ZSwiUmVjZWlwdDpVIjp0cnVlLCJSZWNlaXB0OkQiOnRydWV9fSx7IkF0dGFjaG1lbnRTZXJ2aWNlIjp7IkF0dGFjaG1lbnQ6QyI6dHJ1ZSwiQXR0YWNobWVudDpSIjp0cnVlLCJBdHRhY2htZW50OlUiOnRydWUsIkF0dGFjaG1lbnQ6RCI6dHJ1ZX19LHsiTWVkaWFTZXJ2aWNlIjp7Ik1lZGlhOkMiOnRydWUsIk1lZGlhOlIiOnRydWUsIk1lZGlhOlUiOnRydWUsIk1lZGlhOkQiOnRydWV9fSx7IlBlcnNpc3RNZW51U2VydmljZSI6eyJQZXJzaXN0TWVudTpDIjp0cnVlLCJQZXJzaXN0TWVudTpSIjp0cnVlLCJQZXJzaXN0TWVudTpVIjp0cnVlLCJQZXJzaXN0TWVudTpEIjp0cnVlfX0seyJJbnRlZ3JhdGlvblNlcnZpY2UiOnsiSW50ZWdyYXRpb246QyI6dHJ1ZSwiSW50ZWdyYXRpb246UiI6dHJ1ZSwiSW50ZWdyYXRpb246VSI6dHJ1ZSwiSW50ZWdyYXRpb246RCI6dHJ1ZX19LHsiQUlSZXNvbHZlck1hcFNlcnZpY2UiOnsiQUlSZXNvbHZlck1hcDpDIjp0cnVlLCJBSVJlc29sdmVyTWFwOlIiOnRydWUsIkFJUmVzb2x2ZXJNYXA6VSI6dHJ1ZSwiQUlSZXNvbHZlck1hcDpEIjp0cnVlfX0seyJLZXlTdG9yZVNlcnZpY2UiOnsiS2V5U3RvcmU6QyI6dHJ1ZSwiS2V5U3RvcmU6UiI6dHJ1ZSwiS2V5U3RvcmU6VSI6dHJ1ZSwiS2V5U3RvcmU6RCI6dHJ1ZX19LHsiRW50aXR5U2VydmljZSI6eyJFbnRpdHk6QyI6dHJ1ZSwiRW50aXR5OlIiOnRydWUsIkVudGl0eTpVIjp0cnVlLCJFbnRpdHk6RCI6dHJ1ZX19LHsiQ29udGV4dE1hcFNlcnZpY2UiOnsiQ29udGV4dE1hcDpDIjp0cnVlLCJDb250ZXh0TWFwOlIiOnRydWUsIkNvbnRleHRNYXA6VSI6dHJ1ZSwiQ29udGV4dE1hcDpEIjp0cnVlfX0seyJBdXRvbWF0aW9uRG5zTWFwU2VydmljZSI6eyJBdXRvbWF0aW9uRG5zTWFwOkMiOnRydWUsIkF1dG9tYXRpb25EbnNNYXA6UiI6dHJ1ZSwiQXV0b21hdGlvbkRuc01hcDpVIjp0cnVlLCJBdXRvbWF0aW9uRG5zTWFwOkQiOnRydWV9fSx7IkNoYXRIaXN0b3J5U2VydmljZSI6eyJDaGF0SGlzdG9yeTpDIjp0cnVlLCJDaGF0SGlzdG9yeTpSIjp0cnVlLCJDaGF0SGlzdG9yeTpVIjp0cnVlLCJDaGF0SGlzdG9yeTpEIjp0cnVlfX0seyJTZXJ2ZXJSZWdpc3RyeVNlcnZpY2UiOnsiU2VydmVyUmVnaXN0cnk6QyI6dHJ1ZSwiU2VydmVyUmVnaXN0cnk6UiI6dHJ1ZSwiU2VydmVyUmVnaXN0cnk6VSI6dHJ1ZSwiU2VydmVyUmVnaXN0cnk6RCI6dHJ1ZX19LHsiVXNlckludGVncmF0aW9uU2VydmljZSI6eyJVc2VySW50ZWdyYXRpb246QyI6dHJ1ZSwiVXNlckludGVncmF0aW9uOlIiOnRydWUsIlVzZXJJbnRlZ3JhdGlvbjpVIjp0cnVlLCJVc2VySW50ZWdyYXRpb246RCI6dHJ1ZX19LHsiVGVuYW50QWN0aXZpdGllc1NlcnZpY2UiOnsiVGVuYW50QWN0aXZpdGllczpDIjp0cnVlLCJUZW5hbnRBY3Rpdml0aWVzOlIiOnRydWUsIlRlbmFudEFjdGl2aXRpZXM6VSI6dHJ1ZSwiVGVuYW50QWN0aXZpdGllczpEIjp0cnVlfX0seyJNYXJrZXRwbGFjZVJldmlld1NlcnZpY2UiOnsiTWFya2V0cGxhY2VSZXZpZXc6QyI6dHJ1ZSwiTWFya2V0cGxhY2VSZXZpZXc6UiI6dHJ1ZSwiTWFya2V0cGxhY2VSZXZpZXc6VSI6dHJ1ZSwiTWFya2V0cGxhY2VSZXZpZXc6RCI6dHJ1ZX19LHsiQWN0aXZpdHlVc2VyUmVnaXN0cnlTZXJ2aWNlIjp7IkFjdGl2aXR5VXNlclJlZ2lzdHJ5OkMiOnRydWUsIkFjdGl2aXR5VXNlclJlZ2lzdHJ5OlIiOnRydWUsIkFjdGl2aXR5VXNlclJlZ2lzdHJ5OlUiOnRydWUsIkFjdGl2aXR5VXNlclJlZ2lzdHJ5OkQiOnRydWV9fSx7IlN1YnNjcmlwdGlvblNlcnZpY2UiOnsiU3Vic2NyaXB0aW9uOkMiOnRydWUsIlN1YnNjcmlwdGlvbjpSIjp0cnVlLCJTdWJzY3JpcHRpb246VSI6dHJ1ZSwiU3Vic2NyaXB0aW9uOkQiOnRydWV9fSx7Ik1ldGFkYXRhU2VydmljZSI6eyJNZXRhZGF0YTpDIjp0cnVlLCJNZXRhZGF0YTpSIjp0cnVlLCJNZXRhZGF0YTpVIjp0cnVlLCJNZXRhZGF0YTpEIjp0cnVlfX1dLCJpYXQiOjE1NTM1MDc5NjksImV4cCI6MTU1NjA5OTk2OSwiYXVkIjoiaHR0cDovL3Ntb290aGZsb3cuaW8iLCJpc3MiOiJzbW9vdGhmbG93LmlvIiwic3ViIjoiIn0.GK_D2trBNnK5FyGOHuDjPGd-fy408ZV2BTSsQpWh-RclGGlCyQz5sDCft9X-QzeLgdtq7ldeTg9ykrr-os1TRmWIACfala86zPLRqdOMLY2EX1AHPJdyXeoQvkZ-yOIaMg3W1Puviq-qUeAN0fUFlC2YCN2daLnwUarY-Crh1ds'
    bootstrapWorkspace (workspace) {
        const u = window.location.href;
        const f = '?r=';
        this.setState(s => ({...s, loading: true}));

        localStorage.setItem('scopes', workspace);
        if (u.indexOf(f) !== -1) {
            window.location.replace(u.split(f)[1]);
        } else {
            window.location.href = '/app/';
        }
    }

    render() {
        return (
            <div className="sf-workspace-wrap">
                {
                    !this.state.loading
                    ?
                        <Wrap>
                            <form name="newWorkspaceForm" onSubmit={(e) => this.initiateWorkspace(e)}>
                                <div className="workspace-intro">
                                    <h1>Let's create your first Workspace</h1>
                                    <p>Workspace is the container for all of your projects. You may create several projects inside a Workspace. You can create different Workspaces for your projects as you like.</p>
                                </div>

                                <div className="workspace-inputs-wrap">
                                    <input type="text" id="workspaceName" placeholder="Workspace Name" className="workspace-name-input"  onChange={(e) => this.handleFormInputs(e)} required/>
                                    <button className="sf-button sf-button-primary sf-button-primary-p workspace-create" type="submit">Create</button>
                                </div>
                            </form>
                        </Wrap>
                    :   <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{position: 'relative', width: '30px', height: '30px'}}>
                                <Preloader type={'PRIMARY'}/>
                            </div>
                            <span style={{marginLeft: '15px'}}>Getting your workspaces ready...</span>
                        </div>
                }
            </div>
        )
    }
}

const setStateToProps = state => ({
    user : state.user
});
const history = createHashHistory();
export default (connect(setStateToProps))(WorkspaceView);