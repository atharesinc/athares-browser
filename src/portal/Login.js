import React, { Fragment, PureComponent } from "react";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";
import {Link, withRouter} from "react-router-dom";
import Gun from "gun/gun";
import {withGun} from "../utils/react-gun";

import { validateLogin } from "../utils/validators";

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            email: ""
        };
        // this.gun = props.gun;
        this.user =  this.props.gun.user();
    }
    tryLogin = async () => {

        const isValid = validateLogin({ ...this.state.login });

        if (isValid !== undefined) {
            swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
            return false;
        }

        // this.user

        // try {
        //     let res = await this.props.signinUser({
        //         variables: { ...this.state.login }
        //     });

        //     const { user } = res.data.signinUser;
        //     this.props.setUser({ variables: { id: user.id } });
        //     this.props.history.push("/app");
        // } catch (err) {
        //     console.log(err);
        //     swal("Error", "No user found with that information", "error");
        // }
    };
    updateInfo = () => {
       
            this.setState({
                password: document.getElementById("loginPassword").value,
                email: document.getElementById("loginEmail").value       
        });
    };
    render() {
        const { email, password } = this.state;
        return (<Fragment>
                <div id="portal-header">
                    <img
                        src="/img/Athares-logo-small-white.png"
                        id="portal-logo"
                        alt="logo"
                    />
                    <img
                        src="/img/Athares-full-small-white.png"
                        id="portal-brand"
                        alt="brand"
                    />
                </div>
            <div className="wrapper" id="portal-login">
                <p className="portal-text">Login with the form below</p>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="at-sign"
                    />
                    <input
                        placeholder="Email"
                        className="portal-input h2 ghost pa2"
                        required
                        type="email"
                        onChange={this.updateInfo}
                        value={email}
                        id="loginEmail"
                        tabIndex="1"
                    />
                </div>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="lock"
                    />
                    <input
                        type="password"
                        className="portal-input h2 ghost pa2"
                        placeholder="Password"
                        id="loginPassword"
                        onChange={this.updateInfo}
                        value={password}
                        tabIndex="2"
                    />
                </div>
                <button
                    id="login-button"
                    className="f6 link dim br-pill ba bg-white bw1 ph3 pv2 mb2 dib black"
                    onClick={this.tryLogin}
                    tabIndex="3"
                >
                    LOGIN
                </button>
               <Link to="register"> <div
                    className="switch-portal"
                >
                    I want to register
                </div>
                </Link>
            </div>
            </Fragment>
        );
    }
}

export default withRouter(withGun(Login));