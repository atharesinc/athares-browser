import React, { Component } from "react";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";

import { Switch, Route, withRouter } from "react-router-dom";
import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Portal from "./portal";
import About from "./splash/about";
import PrivateRoute from "./app/PrivateRoute.js";
import NoMatch from "./404";
import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import { TweenMax } from "gsap";
import { setStateFromUri } from "./graphql/mutations";
import { graphql } from "react-apollo";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth
        };
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
        let uri = this.props.location.pathname;

        await this.props.setStateFromUri({ variables: { uri } });

        window.addEventListener(
            "resize",
            throttle(this.updateWidth.bind(this), 1000)
        );
        this.routeFix();
    }
    routeFix = () => {
        let uri = this.props.location.pathname;

        if (/\/login/.test(uri)) {
            document
                .getElementById("root")
                .removeEventListener("mousemove", this.parallaxApp, true);
            document
                .getElementById("root")
                .addEventListener("mousemove", this.parallaxLogin, true);
            document.getElementById("root").style.overflow = "hidden";
        } else if (/\/app/.test(uri)) {
            document
                .getElementById("root")
                .removeEventListener("mousemove", this.parallaxLogin, true);
            document
                .getElementById("root")
                .addEventListener("mousemove", this.parallaxApp, true);
            document.getElementById("root").style.overflow = "hidden";
        } else {
            document.getElementById("root").style.overflow = "auto";
            document
                .getElementById("root")
                .removeEventListener("mousemove", this.parallaxApp, true);
            document
                .getElementById("root")
                .removeEventListener("mousemove", this.parallaxLogin, true);
        }
    };
    parallaxLogin = e => {
        this.parallaxIt(e, "#portal-wrapper", 30, "#entry-portal");
        this.parallaxIt(e, "#entry-portal", -30, "#entry-portal");
    };
    parallaxApp = e => {
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
        console.log();
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
            <Switch>
                <Route exact path="/" component={SplashPage} />
                <Route exact path="/roadmap" component={Roadmap} />
                <Route exact path="/about" component={About} />
                <Route
                    exact
                    path="/login"
                    component={props => (
                        <div id="entry-portal" className="high-img">
                            <Portal {...props} />
                        </div>
                    )}
                />
                <PrivateRoute
                    path="/app"
                    component={props => (
                        <div className="wrapper high-img" id="main-layout">
                            {this.state.width >= 768 ? (
                                <DesktopLayout {...props} />
                            ) : (
                                <MobileLayout {...props} />
                            )}
                        </div>
                    )}
                />
                <Route component={NoMatch} />
            </Switch>
        );
    }
}

export default graphql(setStateFromUri, { name: "setStateFromUri" })(
    withRouter(App)
);
