import React, { Component } from "react";
import Login from "./Login";
import Register from "./Register";
import swal from "sweetalert";
import Loader from "../app/Loader";

import { validateLogin, validateRegister } from "../utils/validators";
import { signinUser, createUser, setUser } from "../graphql/mutations";
import { getUserLocal } from "../graphql/queries";

import { graphql, compose } from "react-apollo";

class EntryPortal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginVisible: true,
            register: {
                firstName: "",
                lastName: "",
                password: "",
                email: ""
            },
            login: {
                password: "",
                email: ""
            }
        };
    }

    updateRegisterInfo = user => {
        this.setState({
            register: { ...user }
        });
    };
    updateLoginInfo = user => {
        this.setState({
            login: { ...user }
        });
    };
    togglePortal = () => {
        this.setState({
            loginVisible: !this.state.loginVisible
        });
    };
    // getAllDataAndSave = async id => {
    //     try {
    //         const res = await this.props.getAllData.refetch({
    //             id,
    //             idString: id
    //         });
    //         console.log(res);

    //         if (res.data.User === null) {
    //             return false;
    //         }
    //         const success = await this.props.saveAllData({
    //             variables: {
    //                 allUserData: res.data.User,
    //                 allChannels: res.data.allChannels
    //             }
    //         });
    //         console.log("breakpoint 5", success);

    //         return true;
    //     } catch (err) {
    //         console.log(new Error(err));
    //         return false;
    //     }
    // };
    tryLogin = async () => {
        const isValid = validateLogin({ ...this.state.login });

        if (isValid !== undefined) {
            swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
            return false;
        }

        try {
            let res = await this.props.signinUser({
                variables: { ...this.state.login }
            });

            const { user } = res.data.signinUser;
            this.props.setUser({ variables: { id: user.id } });
            this.props.history.push("/app");
        } catch (err) {
            console.log(err);
            swal("Error", "No user found with that information", "error");
        }
    };

    tryRegister = async () => {
        const isValid = validateRegister({
            ...this.state.register
        });

        if (isValid !== undefined) {
            swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
            return false;
        }

        try {
            let res = await this.props.createUser({
                variables: { ...this.state.register }
            });

            const user = res.data.createUser;

            this.props.setUser({ variables: { id: user.id } });
            this.props.history.push("/app");
        } catch (err) {
            console.log(err);
            swal(
                "Error",
                "User already exists with that information.",
                "error"
            );
        }
    };
    render() {
        const { user, error, loading } = this.props.getUserLocal;
        if (loading) {
            return (
                <div id="portal-wrapper">
                    <div id="portal-header">
                        <img
                            src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
                            id="portal-logo"
                            alt="logo"
                        />
                        <img
                            src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-full-small-white.png"
                            id="portal-brand"
                            alt="brand"
                        />
                    </div>
                    <Loader />
                </div>
            );
        } else if (user.id !== "") {
            this.props.history.push("/app");
            return null;
        } else if (error) {
            return <div>{error.message}</div>;
        }
        return (
            <div id="portal-wrapper">
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
                {this.state.loginVisible ? (
                    <Login
                        login={this.state.login}
                        updateInfo={this.updateLoginInfo}
                        togglePortal={this.togglePortal}
                        tryLogin={this.tryLogin}
                    />
                ) : (
                    <Register
                        register={this.state.register}
                        updateInfo={this.updateRegisterInfo}
                        togglePortal={this.togglePortal}
                        tryRegister={this.tryRegister}
                    />
                )}
            </div>
        );
    }
}

export default compose(
    graphql(getUserLocal, { name: "getUserLocal" }),
    graphql(setUser, { name: "setUser" }),
    graphql(createUser, { name: "createUser" }),
    graphql(signinUser, { name: "signinUser" })
)(EntryPortal);
