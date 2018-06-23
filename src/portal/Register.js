import React, { PureComponent } from "react";
import FeatherIcon from "feather-icons-react";

export default class Register extends PureComponent {
    updateInfo = () => {
        let user = {
            firstName: document.getElementById("registerFirstName").value,
            lastName: document.getElementById("registerLastName").value,
            password: document.getElementById("registerPassword").value,
            email: document.getElementById("registerEmail").value
        };
        this.props.updateInfo(user);
    };
    render() {
        const { firstName, lastName, email, password } = this.props.register;
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
                        placeholder="First Name"
                        id="registerFirstName"
                        onChange={this.updateInfo}
                        value={firstName}
                        tabIndex="1"
                    />
                </div>
                <div className="portal-input-wrapper">
                    <FeatherIcon
                        className="portal-input-icon h1 w1"
                        icon="user"
                    />
                    <input
                        type="text"
                        className="portal-input h2 ghost pa2"
                        placeholder="Last Name"
                        id="registerLastName"
                        onChange={this.updateInfo}
                        value={lastName}
                        tabIndex="2"
                    />
                </div>
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
                        id="registerEmail"
                        tabIndex="3"
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
                        value={password}
                        tabIndex="4"
                    />
                </div>
                <button
                    id="register-button"
                    className="f6 link dim br-pill bg-white ba bw1 ph3 pv2 mb2 dib black"
                    onClick={this.props.tryRegister}
                    tabIndex="4"
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
