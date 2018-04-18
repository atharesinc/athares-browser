import React, { Component } from "react";
import Phone from "react-phone-number-input";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import FeatherIcon from "feather-icons-react";

export default class Login extends Component {
    updateInfo = () => {
        let login = {
            password: document.getElementById("loginPassword").value,
            phone: document.getElementById("loginPhone").value
        };
        this.props.updateInfo(login);
    };
    render() {
        return (
            <div className="wrapper" id="portal-login">
                <p className="portal-text">Login with the form below</p>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="phone"
                    />
                    <Phone
                        placeholder="Phone Number"
                        country="US"
                        inputClassName="db w-100 ghost pa2"
                        aria-describedby="name-desc"
                        required
                        onChange={this.updateInfo}
                        nativeCountrySelect
                        className="portal-input"
                        id="loginPhone"
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
                    />
                </div>
                <button
                    id="login-button"
                    className="f6 link dim br-pill ba bw1 ph3 pv2 mb2 dib black"
                    onClick={this.props.tryLogin}
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
