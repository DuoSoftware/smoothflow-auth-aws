import React, { Component } from 'react'
import {Button, Card, Input} from "../../_COMPONENTS_";
import { createHashHistory } from 'history';
import './sf-signup.scss'
import Wrap from "../../_COMPONENTS_/_common_/wrap/sf-wrap.component";
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify'
import { connect } from 'react-redux'
import {Preloader} from "../../_COMPONENTS_/_common_/sf-preloader/sf-preloader.component";
import SignInWithFacebook from "../sf-signup-facebook.component";
import SignInWithGoogle from "../sf-signup-google.component";
import { toastr } from 'react-redux-toastr';
import { SubscriptionService } from "../../_CORE_/services";
import {Plan} from "../../_CORE_/actions";

class SignUpView extends Component {

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
            confirmCode: '',
            passwordType: 'password',
            passwordStrong: false,
            initConfirm: false,
            error: {
                code: "",
                message: "",
                name: ""
            }
        }
    };
    componentDidMount() {
        if (this.props.location.forceConfirm && this.props.location.username) {
            this.setState(state => ({
                ...state,
                initConfirm: true,
                user: {
                    username: this.props.location.username
                }
            }));
        }
        const urlplan = this.props.location.search;
        if (urlplan != "") {
            const plan = urlplan.split('=')[1];
            this.props.dispatch(Plan(plan));
        } else {
            this.props.dispatch(Plan("free_plan"));
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

    signUp = (e) => {
        e.preventDefault();
        if (!this.state.passwordStrong) return -1;
        this.setState(state => ({
            ...state,
            loading: true
        }));
        const _ampAuthObj = {
            username: this.state.user.username,
            password: this.state.user.password,
            attributes: {
                "email": this.state.user.email,
                "family_name": this.state.user.family_name,
                "given_name": this.state.user.given_name,
                "name": this.state.user.given_name + ' ' + this.state.user.family_name
            }
        };

        Auth.signUp(_ampAuthObj)
            .then(data => {
                debugger
                this.setState(state => ({
                    ...state,
                    loading: false,
                    initConfirm: true,
                    error: {
                        code: "",
                        message: "",
                        name: ""
                    }
                }))
            })
            .catch(err => {
                this.setState(state => ({
                    ...state,
                    error: err,
                    loading: false
                }));
            });

    };

    submitConfirmation = (e) => {
        e.preventDefault();
        this.setState(state => ({
            ...state,
            loading: true
        }));
        Auth.confirmSignUp(this.state.user.username, this.state.confirmCode, {
            forceAliasCreation: true
        }).then(data => {
            debugger
            if (data === 'SUCCESS') {
                toastr.success('Success', 'You have successfully Signed Up with Smoothflow. Log In to continue.');
                history.push('/');
            }
            this.setState(state => ({
                ...state,
                loading: false
            }));
        })
            .catch(err => {
                debugger
                this.setState(state => ({
                    ...state,
                    error: err,
                    loading: false
                }));
            });
    };

    resendConfirmationCode = (e) => {
        Auth.resendSignUp(this.state.user.username).then(() => {
            console.log('code resent successfully');
        }).catch(e => {
            console.log(e);
        });
    };

    completeSignUp = (e) => {

    };

    render() {
        return (
            <Wrap>
                {
                    !this.state.initConfirm
                        ?
                        <Card className="sf-signup">
                            <form name="sfSingUpForm" onSubmit={(e) => this.signUp(e)}>
                                <div className="sf-row">
                                    <Input type="text" id="first-name" placeholder="First Name"
                                           className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)}
                                           required/>
                                    <div style={{width: '15px'}}></div>
                                    <Input type="text" id="last-name" placeholder="Last Name" className="sf-auth-input"
                                           onChange={(e) => this.handleFormInputs(e)} required/>
                                </div>
                                <Input type="email" id="email" placeholder="Email" className="sf-auth-input"
                                       onChange={(e) => this.handleFormInputs(e)} autoComplete="new-email" required/>
                                <div className="sf-row sf-input-icon">
                                    <Input type={this.state.passwordType} id="password" placeholder="Password"
                                           className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required autoComplete="new-password" />
                                    <i className="material-icons" id="togglePassword" onClick={(e) => this.handleFormInputs(e)}>{ this.state.passwordType === 'password' ? 'visibility_off' : 'visibility' }</i>

                                </div>

                                <div className="sf-errors-inblock">
                                    <p>{this.state.error.message}</p>
                                </div>

                                <Button type="submit"
                                        desabled={this.state.loading}
                                        className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                                    {this.state.loading
                                        ? <Preloader/>
                                        : 'Sign Up'
                                    }
                                </Button>
                            </form>
                            <div className="sf-federated-auth">
                                <SignInWithFacebook style={{marginBottom: '15px'}} />
                                <SignInWithGoogle />
                            </div>
                        </Card>
                        :
                        <Card className="sf-signup">
                            <form name="sfConfirmForm" onSubmit={(e) => this.submitConfirmation(e)}>
                                <p>Please go to your email and enter the code that we have sent for confirmation
                                    here.</p>
                                <div className="sf-row">
                                    <Input type="text" id="confirm" placeholder="Code" className="sf-auth-input"
                                           value={this.state.confirmCode} onChange={(e) => this.handleFormInputs(e)} required/>
                                    <div style={{width: '15px'}}></div>
                                    <Button type="button" onClick={(e) => this.resendConfirmationCode(e)}
                                            disabled={this.state.loading} className="sf-button"
                                            style={{marginBottom: '15px'}}>Resend</Button>
                                </div>

                                <div className="sf-errors-inblock">
                                    <p>{this.state.error.message}</p>
                                </div>

                                <Button type="submit" disabled={this.state.loading}
                                        className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                                    {this.state.loading
                                        ? <Preloader/>
                                        : 'Continue'
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
const setStateToProps = state =>({
    user: state.user
});
export default (connect(setStateToProps))(SignUpView);