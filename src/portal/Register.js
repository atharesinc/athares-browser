import React, { Component } from "react";
import Phone from "react-phone-number-input";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";

import FeatherIcon from "feather-icons-react";

export default class Register extends Component {
    updateInfo = () => {
        let register = {
            fullName: document.getElementById("registerFullName").value,
            password: document.getElementById("registerPassword").value,
            phone: document.getElementById("registerPhone").value
        };
        this.props.updateInfo(register);
    };
    render() {
        return (
            <div className="wrapper" id="portal-register">
                <p className="portal-text">
                    Create an account by completing the following fields
                </p>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="user"
                    />
                    <input
                        type="text"
                        className="portal-input h2 ghost pa2"
                        placeholder="Full Name"
                        id="registerFullName"
                        onChange={this.updateInfo}
                    />
                </div>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="phone"
                    />
                    <Phone
                        placeholder="Phone Number"
                        country="US"
                        inputClassName="db w-100 ghost pa2"
                        aria-describedby="register-phone"
                        required
                        onChange={this.updateInfo}
                        nativeCountrySelect
                        className="portal-input"
                        id="registerPhone"
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
                        id="registerPassword"
                        onChange={this.updateInfo}
                    />
                </div>
                <button
                    id="register-button"
                    className="f6 link dim br-pill bg-white ba bw1 ph3 pv2 mb2 dib black"
                    onClick={this.props.tryRegister}
                >
                    REGISTER
                </button>
                <div
                    className="switch-portal"
                    onClick={this.props.togglePortal}
                >
                    I already have an account
                </div>
            </div>
        );
    }
}
