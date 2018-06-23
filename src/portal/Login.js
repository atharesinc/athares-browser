import React, { PureComponent } from "react";
import FeatherIcon from "feather-icons-react";

export default class Login extends PureComponent {
    updateInfo = () => {
        let login = {
            password: document.getElementById("loginPassword").value,
            email: document.getElementById("loginEmail").value
        };
        this.props.updateInfo(login);
    };
    render() {
        const { email, password } = this.props.login;
        return (
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
                    onClick={this.props.tryLogin}
                    tabIndex="3"
                >
                    LOGIN
                </button>
                <div
                    className="switch-portal"
                    onClick={this.props.togglePortal}
                >
                    I want to register
                </div>
            </div>
        );
    }
}
