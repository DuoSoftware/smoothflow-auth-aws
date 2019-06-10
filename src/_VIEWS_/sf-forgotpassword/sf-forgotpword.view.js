import React, { Component } from 'react'
import {Button, Card, Input} from "../../_COMPONENTS_";
import './sf-forgotpword.scss'
import Wrap from "../../_COMPONENTS_/_common_/wrap/sf-wrap.component";
import { Link } from 'react-router-dom'
import {Auth} from "aws-amplify/lib/index";
import {Preloader} from "../../_COMPONENTS_/_common_/sf-preloader/sf-preloader.component";
import {toastr} from "react-redux-toastr";
import { createHashHistory } from 'history';

class ForgotPasswordView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            forgotPassword: {
                email: '',
                code: '',
                password: ''
            },
            passwordType: 'password',
            newPasswordsForm: false,
            error: {
                code: "",
                message: "",
                name: ""
            }
        }
    };
    handleFormInputs = (e) => {
        const _id = e.target.id;
        const _val = e.target.value;

        switch (_id) {
            case 'email' :
                this.setState(state => ({
                    ...state,
                    forgotPassword: {
                        ...state.forgotPassword,
                        email: _val
                    }
                }));
                break;

            case 'code' :
                this.setState(state => ({
                    ...state,
                    forgotPassword: {
                        ...state.forgotPassword,
                        code: _val
                    }
                }));
                break;

            case 'password' :
                this.setState(state => ({
                    ...state,
                    forgotPassword: {
                        ...state.forgotPassword,
                        password: _val
                    }
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
    sendRequest = (e) => {
        e.preventDefault();
        this.setState(state => ({
            ...state,
            loading: true
        }));
        const username = this.state.forgotPassword.email;
        Auth.forgotPassword(username)
            .then(data => {
                // debugger;
                this.setState(state => ({
                    ...state,
                    loading: false
                }));
                this.newPasswordsInit();
            })
            .catch(err => {
                err.message = err.message.replace('UserMigration failed with error ', '');
                this.setState(state => ({
                    ...state,
                    error: err,
                    loading: false
                }));
            });
    }
    newPasswordsInit () {
        this.setState(state => ({
            ...state,
            newPasswordsForm: true,
            forgotPassword: {
                ...state.forgotPassword,
                code: ''
            },
            error: {
                code: "",
                message: "",
                name: ""
            }
        }));
    }
    updateNewPassword (e) {
        e.preventDefault();
        const _self = this;
        this.setState(state => ({
            ...state,
            loading: true
        }));
        const username = this.state.forgotPassword.email;
        const code = this.state.forgotPassword.code;
        const new_password = this.state.forgotPassword.password;

        // Collect confirmation code and new password, then
        Auth.forgotPasswordSubmit(username, code, new_password)
            .then(data => {
                this.setState(state => ({
                    ...state,
                    loading: false
                }));
                _self.props.history.push('/');
                toastr.success("Success", "Password changed successfully.");
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
            <Wrap>
                {
                    !this.state.newPasswordsForm
                    ?
                        <Card className="sf-forgotpword">
                            <form name="sfConfirmForm" onSubmit={(e) => this.sendRequest(e)}>
                                <p>Please enter the email that you want to send the password reset request
                                    verification to.</p>
                                <Input type="email" id="email" placeholder="Email" className="sf-auth-input"
                                           onChange={(e) => this.handleFormInputs(e)} required/>
                                <div className="sf-errors-inblock">
                                    <p>{this.state.error.message}</p>
                                </div>

                                <Button type="submit" disabled={this.state.loading}
                                        className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                                    {this.state.loading
                                        ? <Preloader/>
                                        : 'Send Request'
                                    }
                                </Button>
                            </form>
                        </Card>
                    :
                        <Card className="sf-forgotpword">
                            <p>We have sent a verification code to the given email. Please insert it and other required information below.</p>
                            <form name="sfSingUpForm" onSubmit={(e) => this.updateNewPassword(e)}>
                                <Input type="email" id="email" placeholder="Email" value={this.state.forgotPassword.email}
                                       className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required/>
                                <Input type="text" id="code" placeholder="Code" value={this.state.forgotPassword.code}
                                       className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required/>
                                <div className="sf-row sf-input-icon">
                                    <Input type={this.state.passwordType} id="password" placeholder="New Password"
                                           className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required/>
                                    <i className="material-icons" id="togglePassword" onClick={(e) => this.handleFormInputs(e)}>visibility_off_outlined</i>
                                </div>

                                <div className="sf-errors-inblock">
                                    <p>{this.state.error.message}</p>
                                </div>

                                <Button type="submit"
                                        desabled={this.state.loading}
                                        className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                                    {this.state.loading
                                        ? <Preloader/>
                                        : 'Change Password'
                                    }
                                </Button>
                            </form>
                        </Card>
                }
                <div className="sf-auth-footer">
                    Back to <Link to={'/'}><b>Sign In</b></Link>
                </div>
            </Wrap>
        )
    }

}

const history = createHashHistory();
export default ForgotPasswordView;