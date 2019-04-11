import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Button, Card, Input} from "../../_COMPONENTS_";
import {Preloader} from "../../_COMPONENTS_/_common_/sf-preloader/sf-preloader.component";
import SignInWithFacebook from "../sf-signup-facebook.component";
import SignInWithGoogle from "../sf-signup-google.component";
import { Auth } from 'aws-amplify'
import axios from "axios/index";
import {User} from "../../_CORE_/actions";

class InvitedSignUpView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: {
                username: '',
                password: '',
                email: '',
                family_name: '',
                given_name: ''
            },
            passwordType: 'password',
            passwordStrong: false,
            error: {
                code: "",
                message: "",
                name: ""
            }
        }
    }

    componentDidMount() {
        const user = this.props.user.invited_user;
        if (user) {
            this.setState(s=>({
                ...s,
                user : {
                    ...s.user,
                    email : user.challengeParam.userAttributes.email
                }
            }));
        } else {
            this.props.history.push('/signin');
        }
    }
    handleFormInputs = (e) => {
        const _id = e.target.id;
        const _val = e.target.value;

        switch (_id) {
            case 'first-name' :
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        given_name: _val
                    }
                }));
                break;
            case 'last-name' :
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        family_name: _val
                    }
                }));
                break;
            case 'email' :
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        username: _val,
                        email: _val
                    }
                }));
                break;
            case 'password' :
                let _error = {
                    message: null,
                    strong: false
                };
            function _validate () {
                const regx = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
                if (regx.test(_val)) {
                    return {
                        message: '',
                        strong: true
                    };
                }
                else {
                    return {
                        message: 'Password should contain a minimum of 8 characters including an Upper Case character, a Numeric character and a Special character',
                        strong: false
                    };
                }
            };
                if (_val === '') _error.message = '';
                else _error = _validate();

                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        password: _val
                    },
                    error: {
                        message: _error.message
                    },
                    passwordStrong: _error.strong
                }));
                break;
            case 'confirm' :
                this.setState(state => ({
                    ...state,
                    confirmCode: _val
                }));
                break;

            case 'togglePassword' :
                const _type = this.state.passwordType === 'password' ? 'text' : 'password';
                this.setState(state => ({
                    ...state,
                    passwordType: _type
                }));
                break;

            default:
                break;

        }
    };
    completeInvitation(e) {
        e.preventDefault();
        if (!this.state.passwordStrong) return -1;
        this.setState(state => ({
            ...state,
            loading: true
        }));
        const user = this.props.user.invited_user;
        const newPassword = this.state.user.password;
        const optional = {
            email : this.state.user.email,
            family_name: this.state.user.family_name,
            given_name: this.state.user.given_name
        };
        Auth.completeNewPassword(user, newPassword, optional)
            .then(data => {
                debugger
                this.props.history.push('/workspaces');
            })
            .catch(err => {
                this.setState(state => ({
                    ...state,
                    error: err,
                    loading: false
                }));
            });
    }

    render() {
        return (
            <Card className="sf-signup">
                <p style={ {textAlign: 'center'} }>Please provide below details to complete your Signup</p>
                <form name="sfSingUpForm" onSubmit={(e) => this.completeInvitation(e)}>
                    <div className="sf-row">
                        <Input type="text" id="first-name" placeholder="First Name"
                               className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)}
                               required/>
                        <div style={{width: '15px'}}></div>
                        <Input type="text" id="last-name" placeholder="Last Name" className="sf-auth-input"
                               onChange={(e) => this.handleFormInputs(e)} required/>
                    </div>
                    <Input type="email" id="email" placeholder="Email" className="sf-auth-input" value={this.state.user.email} onChange={(e) => this.handleFormInputs(e)} autoComplete="new-email" required/>
                    <div className="sf-row sf-input-icon">
                        <Input type={this.state.passwordType} id="password" placeholder="Password"
                               className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required
                               autoComplete="new-password"/>
                        <i className="material-icons" id="togglePassword"
                           onClick={(e) => this.handleFormInputs(e)}>{this.state.passwordType === 'password' ? 'visibility_off' : 'visibility'}</i>

                    </div>

                    <div className="sf-errors-inblock">
                        <p>{this.state.error.message}</p>
                    </div>

                    <Button type="submit"
                            desabled={this.state.loading}
                            className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                        {   this.state.loading
                                ? <Preloader/>
                                : 'Continue'
                        }
                    </Button>
                </form>
            </Card>
        )

    }
}

const setStateToProps = s =>({
    user : s.user
});
export default (connect(setStateToProps))(InvitedSignUpView);