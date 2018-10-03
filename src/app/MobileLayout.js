import React, { Component, Fragment } from "react";
// import Loader from "./Loader";

import TopNav from "./mobile/TopNav";
import Circles from "./mobile/Circles";
import BottomNav from "./mobile/BottomNav";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { Switch, Route } from "react-router-dom";
import { withGun } from "react-gun";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";

class MobileLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            isOpen: false,
            user: null,
            circles: []
        };
    }
    /*Triggered when swiping between views (mobile only) */
    onChangeIndex = (index, type) => {
        // console.log(index, type);
        if (type === "end") {
            this.setState({
                index: index
            });
        }
    };
    componentDidMount() {
        // get this user's circles
        let userRef = this.props.gun.user();

        userRef.get("profile").once(async user => {
            let circles = [];

            if (this.props.user) {
                let user = this.props.gun.user();
                let circleRef = this.props.gun.get("circles");

                let refsToCircles = [];
                // get this user's circles
                await user.get("circles").map(circle => {
                    refsToCircles.push(circle);
                    return circle;
                });

                // get each circle's data from the array of references
                await refsToCircles.map(async c => {
                    await circleRef.get(c).once(data => {
                        this.setState({
                            circles: [...this.state.circles, data]
                        });
                    });
                });
            }

            this.setState({
                user,
                circles
            });
        });
    }
    /* Triggered when manually switching views (with button) */
    changeIndex = e => {
        const switcher = {
            calendar: 0,
            addTask: 1
        };
        this.setState({
            index: switcher[e]
        });
    };
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
        const { user, circles } = this.state;
        console.log(circles);
        return (
            <div id="app-wrapper-outer" className="wrapper">
                <PushingMenu
                    isOpen={this.state.isOpen}
                    isMenuOpen={this.isMenuOpen}
                    history={this.props.history}
                    user={user}
                />
                <div
                    index={this.state.index}
                    className="wrapper"
                    style={{
                        height: "100vh",
                        width: "100vw"
                    }}
                    id="app-wrapper"
                >
                    <TopNav toggleMenu={this.toggleMenu} />
                    <Switch>
                        <Route
                            exact
                            component={props => (
                                <CirclesAndChannels
                                    activeCircle={this.props.activeCircle}
                                    circles={circles}
                                    {...props}
                                />
                            )}
                            path="/app"
                        />
                        <Route component={props => <Dashboards {...props} />} />
                    </Switch>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        pub: pull(state, "pub"),
        activeCircle: pull(state, "activeCircle")
    };
}

export default withGun(connect(mapStateToProps)(MobileLayout));

const CirclesAndChannels = props => (
    <Fragment>
        <Circles activeCircle={props.activeCircle} circles={props.circles} />
        <Channels {...props} />
        <BottomNav show={props.user} />
    </Fragment>
);
