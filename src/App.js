import React, { Component } from "react";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";

import { Route, withRouter } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Login from "./portal/Login";
import Register from "./portal/Register";
import About from "./splash/about";
import NoMatch from "./404";
import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import { TweenMax } from "gsap";
import Gun from "gun";
import "gun/sea";
import "gun-synclist";
import { GunProvider } from "react-gun";
import { connect } from "react-redux";
import { pull } from "./store/state/reducers";
import * as sync from "./store/state/actions";
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
                    this.props.dispatch(sync.updateUser(profile.id));
                    this.props.dispatch(sync.updatePub(ack.pub));
                    // now that we're logged in, start listening to changes in nodes we care about
                    this.allListeners();
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
    allListeners = () => {
        let user = this.gun.user();

        user.get("circles").synclist(obj => {
            console.log("user circles changed!", obj);
            this.props.dispatch(sync.circlesSync(obj));
            let channels = [];
            let messages = [];

            if (obj.list) {
                // get all data from this circle
                obj.list.forEach(circle => {
                    // get the channels and messages
                    if (circle.channels) {
                        let theseChannels = Object.values(circle.channels);
                        // channels = [...channels, ...theseChannels];
                        theseChannels.forEach(chan => {
                            if (chan.messages) {
                                // strip out messages from channel data
                                let {
                                    messages: theseMessages,
                                    ...thisChan
                                } = chan;
                                channels.push(thisChan);

                                theseMessages = Object.values(theseMessages);
                                console.log(theseMessages);
                                messages = [...messages, ...theseMessages];
                            } else {
                                channels.push(chan);
                            }
                        });
                    }
                    // get other stuff like amendments and revisions
                });
                this.props.dispatch(sync.setMessages(messages));
                this.props.dispatch(sync.setChannels(channels));
            }
        });
        // user.get("channels").synclist(obj => {
        //     this.props.dispatch(sync.channelsSync(obj));
        // });
        user.get("revisions").synclist(obj => {
            this.props.dispatch(sync.revisionsSync(obj));
        });
        user.get("votes").synclist(obj => {
            this.props.dispatch(sync.votesSync(obj));
        });
        user.get("users").synclist(obj => {
            this.props.dispatch(sync.usersSync(obj));
        });
        user.get("amendments").synclist(obj => {
            this.props.dispatch(sync.amendmentsSync(obj));
        });
        user.get("messages").synclist(obj => {
            this.props.dispatch(sync.messagesSync(obj));
        });
    };
    routeFix = () => {
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
            x: ((relX - width / 2) / width) * movement,
            y: ((relY - height / 2) / height) * movement
        });
    };

    render() {
        return (
            <div className="wrapper high-img" id="main-layout">
                <div id="desktop-wrapper-outer" className="wrapper">
                    <div className="wrapper grey-screen" id="desktop-wrapper">
                        <GunProvider gun={this.gun}>
                            <AnimatedSwitch
                                atEnter={{ opacity: 0 }}
                                atLeave={{ opacity: 0 }}
                                atActive={{ opacity: 1 }}
                                className="wrapper switch-wrapper"
                            >
                                <Route
                                    exact
                                    path="/login"
                                    component={props => (
                                        <Login
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/register"
                                    component={props => (
                                        <Register
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
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
                            </AnimatedSwitch>
                        </GunProvider>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, "user")
    };
}
export default withRouter(connect(mapStateToProps)(App));
