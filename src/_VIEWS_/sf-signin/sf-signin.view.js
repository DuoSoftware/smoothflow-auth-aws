import React, { Component } from 'react'
import {Button, Card, Input} from "../../_COMPONENTS_";
import './sf-signin.scss'
import Wrap from "../../_COMPONENTS_/_common_/wrap/sf-wrap.component";
import { Link } from 'react-router-dom'
import SignInWithGoogle from "../sf-signup-google.component";
import SignInWithFacebook from "../sf-signup-facebook.component";
import {Auth} from "aws-amplify/lib/index";
import {Preloader} from "../../_COMPONENTS_/_common_/sf-preloader/sf-preloader.component";
import { createHashHistory } from 'history'
import { connect } from 'react-redux'
import axios from 'axios'
import {InvitedUser, User} from '../../_CORE_/actions'
import {UIHelperService} from "../../_CORE_/services";

class SignInView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: {
                email: '',
                password: ''
            },
            error: {
                code: "",
                message: "",
                name: ""
            }
        }
    };
    componentDidMount() {
        UIHelperService.validateRedirections(this.props.dispatch);
    }
    handleFormInputs = (e) => {
        const _id = e.target.id;
        const _val = e.target.value;

        switch (_id) {
            case 'email' :
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        email: _val
                    }
                }));
                break;
            case 'password' :
                this.setState(state => ({
                    ...state,
                    user: {
                        ...state.user,
                        password: _val
                    }
                }));
                break;
            default:
                break;

        }
    };

    signIn = (e) => {
        e.preventDefault();
        this.setState(state => ({
            ...state,
            loading: true
        }));
        const _ampAuthObj = {
            username: this.state.user.email,
            password: this.state.user.password,
        };

        Auth.signIn(_ampAuthObj)
            .then(user => {
                // debugger
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    this.props.dispatch(InvitedUser(user));
                    this.props.history.push('/invitedsignup');
                } else {
                    this.props.dispatch(User(user.signInUserSession.idToken));
                    this.props.history.push('/workspaces');
                }
            })
            .catch(err => {
                // debugger
                err.message.replace('UserMigration failed with error ', '');
                this.setState(state => ({
                    ...state,
                    error: err,
                    loading: false
                }));
            });

    };

    render() {
        return (
            <Wrap>
                <Card className="sf-signin">
                    <form name="sfSingUInForm" onSubmit={(e) => this.signIn(e)}>
                        <Input type="text" id="email" placeholder="Email"
                               className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)}
                               required/>
                        <div style={ {marginBottom: '15px'} }></div>
                        <Input type="password" id="password" placeholder="Password"
                               className="sf-auth-input" onChange={(e) => this.handleFormInputs(e)} required/>
                        <div style={ {textAlign: 'right'} }>
                            <Link to={'/forgotpassword'}>Forgot password?</Link>
                        </div>
                        <div className="sf-errors-inblock">
                            <p>{this.state.error.message}</p>
                        </div>
                        <Button type="submit"
                                desabled={this.state.loading}
                                className="sf-button sf-button-block sf-button-primary sf-button-primary-p">
                            {this.state.loading
                                ? <Preloader/>
                                : 'Sign In'
                            }
                        </Button>
                    </form>
                    <div className="sf-federated-auth">
                        <SignInWithFacebook style={{marginBottom: '15px'}} />
                        <SignInWithGoogle />
                    </div>
                </Card>
                <div className="sf-auth-footer">
                    New to Smoothflow? <Link to={'/signup'}><b>Sign Up</b></Link>
                </div>
            </Wrap>
        )
    }

}

const history = createHashHistory();
export default (connect())(SignInView);