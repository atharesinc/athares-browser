import React, { Component } from "react";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";

import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Login from "./portal/Login";
import Register from "./portal/Register";
import About from "./splash/about";
import PrivateRoute from "./app/PrivateRoute.js";
import NoMatch from "./404";
import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import { TweenMax } from "gsap";
import Gun from "gun";
import "gun/sea";
import { GunProvider } from "react-gun";
import { connect } from "react-redux";
import { updateUser, updatePub } from "./store/state/actions";
// import Test from "./TestMobile";

// IndexedDb stuff for later
// import "gun/lib/radix.js";
// import "gun/lib/radisk.js";
// import "gun/lib/store.js";
// import "gun/lib/rindexed.js";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth
        };
        // window.Gun = Gun;
        // For indexeddb support later
        //     var opt = {};
        // opt.store = RindexedDB(opt);
        // var gun = Gun(opt);
        this.gun = Gun();
        window.gun = this.gun;
    }
    updateWidth() {
        this.setState({
            width: window.innerWidth
        });
    }
    componentDidUpdate() {
        this.routeFix();
    }
    async componentDidMount() {
        // check if user could log in
        if (sessionStorage.alias && sessionStorage.tmp) {
            this.gun.user().recall({ sessionStorage: true });
            let user = this.gun.user();
            await user.auth(sessionStorage.alias, sessionStorage.tmp, ack => {
                user.get("profile").once(profile => {
                    this.props.dispatch(updateUser(profile.id));
                    this.props.dispatch(updatePub(ack.pub));
                });
            });
        }
        // let uri = this.props.location.pathname;
        // // await this.props.setStateFromUri({ variables: { uri } });
        window.addEventListener(
            "resize",
            throttle(this.updateWidth.bind(this), 1000)
        );
        this.routeFix();
    }
    routeFix = () => {
        let uri = this.props.location.pathname;

        document
            .getElementById("root")
            .addEventListener("mousemove", this.parallaxApp, true);
        document.getElementById("root").style.overflow = "hidden";
    };
    parallaxApp = e => {
        if (this.state.width < 992) {
            return false;
        }
        this.parallaxIt(e, "#desktop-wrapper-outer", 30, "#main-layout");
        this.parallaxIt(e, "#main-layout", -30, "#main-layout");
    };
    componentWillUnmount() {
        window.addEventListener(
            "resize",
            throttle(this.updateWidth.bind(this), 1000)
        );
        document.getElementById("root").addEventListener("mousemove", e => {
            e.stopPropogation();
            e.preventDefault();
        });
    }
    parallaxIt = (e, target, movement, rootElement) => {
        var $this = document.querySelector(rootElement);
        var relX = e.pageX - $this.offsetLeft;
        var relY = e.pageY - $this.offsetTop;

        const height = window.innerHeight * 0.9,
            width = window.innerWidth * 0.9;
        TweenMax.to(target, 1.25, {
            x: (relX - width / 2) / width * movement,
            y: (relY - height / 2) / height * movement
        });
    };

    render() {
        return (
            <div className="wrapper high-img" id="main-layout">
                <div id="desktop-wrapper-outer" className="wrapper">
                    <div className="wrapper grey-screen" id="desktop-wrapper">
                        <GunProvider gun={this.gun}>
                            <Switch>
                                <Route
                                    exact
                                    path="/login"
                                    component={props => <Login {...props} />}
                                />
                                <Route
                                    exact
                                    path="/register"
                                    component={props => <Register {...props} />}
                                />
                                <Route exact path="/" component={SplashPage} />
                                <Route
                                    exact
                                    path="/roadmap"
                                    component={Roadmap}
                                />
                                <Route exact path="/about" component={About} />
                                <Route
                                    path="/app"
                                    component={props =>
                                        this.state.width >= 992 ? (
                                            <DesktopLayout {...props} />
                                        ) : (
                                            <MobileLayout {...props} />
                                        )
                                    }
                                />
                                {/* <Route exact path="/test" component={Test} /> */}
                                <Route component={NoMatch} />
                            </Switch>
                        </GunProvider>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
export default withRouter(connect(mapStateToProps)(App));
