import React, { PureComponent, Fragment } from "react";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";
import "emoji-mart/css/emoji-mart.css";

import { Route, withRouter } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Login from "./portal/Login";
import Register from "./portal/Register";
import About from "./splash/about";
import NoMatch from "./404";
import Policy from "./policy";
import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
import RevisionMonitor from "./components/RevisionMonitor";
import Invite from "./invite";
import Head from "./head";

// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import { TweenMax } from "gsap";

import { connect } from "react-redux";
import { pull } from "./store/state/reducers";
import * as sync from "./store/state/actions";
import LoadingBar from "react-redux-loading-bar";

// web worker stuff
// import worker from "./workers/listener-worker";
// import WebWorker from "./workers/WebWorker";
import { SIGNIN_USER } from "./graphql/mutations";
import { graphql } from "react-apollo";

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth
    };
  }
  updateWidth = () => {
    this.setState({
      width: window.innerWidth
    });
  };
  componentDidUpdate() {
    this.routeFix();
  }
  async componentDidMount() {
    // check if user could log in
    if (
      !this.props.user &&
      localStorage.getItem("ATHARES_ALIAS") &&
      localStorage.getItem("ATHARES_TOKEN")
    ) {
      // indicate that the user is logging in and syncing
      let alias = localStorage.getItem("ATHARES_ALIAS");
      let token = localStorage.getItem("ATHARES_TOKEN");
      const { signinUser } = this.props;

      try {
        const res = await signinUser({
          variables: {
            email: alias,
            password: token
          }
        });

        const {
          data: {
            signinUser: { user }
          }
        } = res;
        this.props.dispatch(sync.updateUser(user.id));
        this.props.dispatch(sync.updatePub(token));
      } catch (err) {
        console.log(new Error(err));
        // there was some sort of error auto-logging in, clear localStorage and redux just in case
        this.props.dispatch(sync.logout());
      }
    }
    window.addEventListener("resize", throttle(this.updateWidth, 1000));
    this.routeFix();
  }

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
    window.addEventListener("resize", throttle(this.updateWidth, 1000));
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
      <Fragment>
        <LoadingBar
          style={{
            height: "0.2em",
            backgroundColor: "#00DFFC",
            boxShadow: "0 0 0.5em #00DFFC",
            zIndex: 1,
            position: "fixed"
          }}
          showFastActions
        />
        <RevisionMonitor />
        <div className="wrapper high-img" id="main-layout">
          <Head />

          <div id="desktop-wrapper-outer" className="wrapper">
            <div className="wrapper grey-screen" id="desktop-wrapper">
              <AnimatedSwitch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0 }}
                atActive={{ opacity: 1 }}
                className="wrapper switch-wrapper"
              >
                <Route
                  exact
                  path="/login"
                  render={props => <Login {...props} />}
                />
                <Route
                  exact
                  path="/register"
                  render={props => <Register {...props} />}
                />
                <Route exact path="/" render={() => <SplashPage />} />
                <Route exact path="/roadmap" render={() => <Roadmap />} />
                <Route exact path="/about" render={() => <About />} />
                <Route exact path="/policy" render={() => <Policy />} />
                <Route
                  path="/app"
                  render={props =>
                    this.state.width >= 992 ? (
                      <DesktopLayout {...props} />
                    ) : (
                      <MobileLayout {...props} />
                    )
                  }
                />
                <Route
                  exact
                  path="/invite/:id"
                  render={props => <Invite {...props} />}
                />
                {/* <Route exact path="/test" component={Test} /> */}
                <Route render={() => <NoMatch />} />
              </AnimatedSwitch>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    revisions: pull(state, "revisions"),
    votes: pull(state, "votes"),
    amendments: pull(state, "amendments"),
    circles: pull(state, "circles")
  };
}
export default graphql(SIGNIN_USER, { name: "signinUser" })(
  withRouter(connect(mapStateToProps)(App))
);
