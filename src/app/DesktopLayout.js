import React, { Component } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { Redirect } from "react-router-dom";
import { getUserLocal } from "../graphql/queries";
// import { subCircles, subUser } from "../graphql/subscriptions";

import { graphql, compose } from "react-apollo";
import Loader from "./Loader";

class DesktopLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }
    componentWillMount() {
        // this.props.getUserLocal.subscribeToMore({
        //     document: subCircles,
        //     variables: { id: this.props.getUserLocal.user.id },
        //     updateQuery: (prev, { subscriptionData }) => {
        //         console.log(subscriptionData);
        //         // update local circles state
        //     }
        // });
        // this.props.getUserLocal.subscribeToMore({
        //     document: subUser,
        //     variables: { id: this.props.getUserLocal.user.id },
        //     updateQuery: (prev, { subscriptionData }) => {
        //         console.log(subscriptionData);
        //     }
        //     // update local user state
        // });
    }
    toggleMenu = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    isMenuOpen = state => {
        this.setState({
            isOpen: state.isOpen
        });
    };
    render() {
        const { error, loading, user } = this.props.getUserLocal;
        if (loading) {
            return (
                <div id="desktop-wrapper-outer" className="wrapper">
                    <div className="wrapper" id="desktop-wrapper">
                        <Loader />
                    </div>
                </div>
            );
        }
        if (error) {
            console.log("Error getting user id from state", error);
        }
        if (user.id !== "") {
            return (
                <div id="desktop-wrapper-outer" className="wrapper">
                    <PushingMenu
                        isOpen={this.state.isOpen}
                        isMenuOpen={this.isMenuOpen}
                        history={this.props.history}
                        userId={user.id}
                    />
                    <div
                        className="wrapper"
                        id="desktop-wrapper"
                        style={{
                            marginLeft: this.state.isOpen
                                ? "calc(30% - 300px)"
                                : ""
                        }}
                    >
                        <Circles
                            {...this.props}
                            toggleMenu={this.toggleMenu}
                            userId={user.id}
                        />
                        <Channels {...this.props} userId={user.id} />
                        <Dashboards {...this.props} userId={user.id} />
                    </div>
                </div>
            );
        } else {
            return (
                <Redirect
                    to={{
                        pathname: "/login"
                    }}
                />
            );
        }
    }
}

export default compose(
    // graphql(subCircles, {
    //     name: "subCircles",
    //     options: ({ id = "" }) => ({
    //         variables: { id }
    //     })
    // }),
    graphql(getUserLocal, { name: "getUserLocal" })
)(DesktopLayout);
