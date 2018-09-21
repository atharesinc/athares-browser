import React, { Fragment, PureComponent } from "react";
import FeatherIcon from "feather-icons-react";
import {  validateRegister } from "../utils/validators";
import {Link, withRouter} from "react-router-dom";
import swal from "sweetalert";
import Gun from "gun/gun";
import {withGun} from "../utils/react-gun";

class Register extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            password: "",
            email: ""
        };
    }
    componentDidMount(){
        this.props.gun.get("test").once((data)=>{
            if(data.name === "success"){
                this.props.gun.get("test").put({name: "more success"});
            }
        })
    }
tryRegister = async () => {
        const isValid = validateRegister({
            ...this.state.register
        });

        if (isValid !== undefined) {
            swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
            return false;
        }


        // try {
        //     let res = await this.props.createUser({
        //         variables: { ...this.state.register }
        //     });

        //     const user = res.data.createUser;

        //     this.props.setUser({ variables: { id: user.id } });
        //     this.props.history.push("/app");
        // } catch (err) {
        //     console.log(err);
        //     swal(
        //         "Error",
        //         "User already exists with that information.",
        //         "error"
        //     );
        // }
    };
    updateInfo = () => {
        this.setState({
            firstName: document.getElementById("registerFirstName").value,
            lastName: document.getElementById("registerLastName").value,
            password: document.getElementById("registerPassword").value,
            email: document.getElementById("registerEmail").value
        });
        
    };
    render() {
        const { firstName, lastName, email, password } = this.state;
        return (
            <Fragment>
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
                    onClick={this.tryRegister}
                    tabIndex="4"
                >
                    REGISTER
                </button>
                <Link to="/login">
                <div
                    className="switch-portal"
                >
                    I already have an account
                </div>
                </Link>
            </div>
            </Fragment>
        );
    }
}

export default withRouter(withGun(Register));