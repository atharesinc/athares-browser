import React, { useState, useGlobal, useEffect, Fragment } from "reactn";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";
import "emoji-mart/css/emoji-mart.css";

import { Route, withRouter } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Login from "./portal/Login";
import Reset from "./portal/Reset";
import Forgot from "./portal/Forgot";
import Register from "./portal/Register";
import About from "./splash/about";
import NoMatch from "./404";
import Policy from "./policy";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import RevisionMonitor from "./components/RevisionMonitor";
import ChannelUpdateMonitor from "./components/ChannelUpdateMonitor";
import DMUpdateMonitor from "./components/DMUpdateMonitor";
import OnlineMonitor from "./components/OnlineMonitor";
import Invite from "./invite";

import throttle from "lodash.throttle";
import { TweenMax } from "gsap";

import { SIGNIN_USER } from "./graphql/mutations";
import { graphql } from "react-apollo";
import { logout } from "./utils/state";

function App(props) {
  const [width, setWidth] = useState(window.innerWidth);
  const [, setUser] = useGlobal("user");
  const [, setPub] = useGlobal("setPub");
  // const [revisions] = useGlobal("revisions");
  // const [votes] = useGlobal("votes");
  // const [amendments] = useGlobal("amendments");
  // const [circles] = useGlobal("circles");

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    routeFix();
  });

  // didMount
  useEffect(() => {
    componentMount();
    return () => {
      window.addEventListener("resize", throttle(updateWidth, 1000));
      document.getElementById("root").addEventListener("mousemove", e => {
        e.stopPropogation();
        e.preventDefault();
      });
    };
  }, []);

  const componentMount = async () => {
    // check if user could log in
    if (
      !props.user &&
      localStorage.getItem("ATHARES_ALIAS") &&
      localStorage.getItem("ATHARES_HASH")
    ) {
      // indicate that the user is logging in and syncing
      let alias = localStorage.getItem("ATHARES_ALIAS");
      let hash = localStorage.getItem("ATHARES_HASH");

      try {
        const res = await props.signinUser({
          variables: {
            email: alias,
            password: hash
          }
        });

        const {
          data: {
            signinUser: { token, userId }
          }
        } = res;
        setUser(userId);
        setPub(hash);
        window.localStorage.setItem("ATHARES_TOKEN", token);
      } catch (err) {
        console.error(new Error(err));
        // there was some sort of error auto-logging in, clear localStorage and redux just in case
        logout();
      }
    }
    window.addEventListener("resize", throttle(updateWidth, 1000));
    routeFix();
  };

  const routeFix = () => {
    document
      .getElementById("root")
      .addEventListener("mousemove", parallaxApp, true);
    document.getElementById("root").style.overflow = "hidden";
  };
  const parallaxApp = e => {
    if (width < 992) {
      return false;
    }
    parallaxIt(e, "#desktop-wrapper-outer", 30, "#main-layout");
    parallaxIt(e, "#main-layout", -30, "#main-layout");
  };

  const parallaxIt = (e, target, movement, rootElement) => {
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

  return (
    <Fragment>
      <OnlineMonitor />
      <RevisionMonitor />
      {props.user && <ChannelUpdateMonitor />}
      {props.user && <DMUpdateMonitor />}
      <div className="wrapper high-img" id="main-layout">
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
              <Route path="/reset/:id" render={props => <Reset {...props} />} />
              <Route
                exact
                path="/forgot"
                render={props => <Forgot {...props} />}
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
                  width >= 992 ? (
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

export default graphql(SIGNIN_USER, { name: "signinUser" })(withRouter(App));
