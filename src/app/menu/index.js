import React, { Component } from "react";
import { pushRotate as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { logout } from "../../store/state/actions";
import { hideInstall, showInstall } from "../../store/ui/actions";
import { connect } from "react-redux";
import { pull } from "../../store/state/reducers";
import { Query } from "react-apollo";
import { GET_USER_BY_ID } from "../../graphql/queries";
const pullUI = require("../../store/ui/reducers").pull;

class MenuWrapper extends Component {
  constructor() {
    super();
    this.deferredPrompt = null;
  }
  logoutUser = async () => {
    this.props.dispatch(logout());
    sessionStorage.clear();

    window.localStorage.removeItem("ATHARES_ALIAS");
    window.localStorage.removeItem("ATHARES_TOKEN");
    window.localStorage.removeItem("ATHARES_HASH");

    this.props.toggleMenu();
  };
  componentDidMount() {
    window.addEventListener("beforeinstallprompt", this.enableInstall);
    window.addEventListener("appinstalled", this.preventAnotherInstall);
  }
  componentWillUnmount() {
    window.removeEventListener("beforeinstallprompt", this.enableInstall);
    window.removeEventListener("appinstalled", this.preventAnotherInstall);
  }
  preventAnotherInstall = () => {
    console.log("User has added the app");
  };
  enableInstall = e => {
    console.log("able to add to desktop");
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    this.props.dispatch(showInstall());
  };
  alsoToggleMenu = () => {
    this.props.toggleMenu();
  };
  install = () => {
    // if (!this.deferredPrompt) {
    //   console.log(this.deferredPrompt, "not installable");
    //   return false;
    // }
    // hide our user interface that shows our A2HS button
    this.props.dispatch(hideInstall());
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      this.deferredPrompt = null;
    });
  };
  render() {
    let { isOpen, history, isMenuOpen, ...props } = this.props;
    return (
      <Query
        query={GET_USER_BY_ID}
        variables={{ id: props.userId || "" }}
        pollInterval={30000}
      >
        {({ data }) => {
          let user = null;
          if (data.User) {
            user = data.User;
          }
          return (
            <Menu
              pageWrapId={"app-wrapper"}
              outerContainerId={"app-wrapper-outer"}
              isOpen={isOpen}
              customBurgerIcon={false}
              customCrossIcon={false}
              menuClassName={"push-menu white pt2"}
              onStateChange={isMenuOpen}
            >
              {user ? (
                <Link
                  className="dt w-100 pb2-ns pv2 pl2-ns pl3 dim hover-bg-black-05"
                  to="/app/user"
                  onClick={this.alsoToggleMenu}
                >
                  <div className="dtc w3 h3 v-mid">
                    <img
                      src={user.icon}
                      className="ba b--white db br-100 w3 h3 bw1"
                      alt="Menu"
                    />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f5 f5-ns fw6 lh-title white mv0">
                      {user.firstName + " " + user.lastName}
                    </h1>
                    <h2 className="f6 f7-ns fw4 mt0 mb0 white-60">
                      View Profile
                    </h2>
                  </div>
                </Link>
              ) : (
                <Link
                  className="dt w-100 pb2-ns pv2 pl2-ns pl3 dim hover-bg-black-05"
                  to="/login"
                >
                  <div className="dtc w3 h3 v-mid">
                    <img
                      src={"/img/user-default.png"}
                      className="ba b--white db br-100 w3 h3 bw1"
                      alt="Menu"
                    />
                  </div>
                  <div className="dtc v-mid pl3">
                    <h1 className="f5 f5-ns fw6 lh-title white mv0">
                      Anonymous
                    </h1>
                    <h2 className="f6 f7-ns fw4 mt0 mb0 white-60">
                      Click to log in
                    </h2>
                  </div>
                </Link>
              )}
              {/* Sub menu */}

              <div className="channel-group-label"> Settings </div>

              <ul className="list pl0 mt0 measure center">
                <Link
                  className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                  to="/about"
                >
                  <FeatherIcon
                    className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                    icon="help-circle"
                  />
                  <div className="pl3 flex-auto" to="about">
                    <span className="f5 db white">About</span>
                    <span className="f7 db white-70">FAQs & Us</span>
                  </div>
                </Link>
                <Link
                  className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                  to="policy"
                >
                  <FeatherIcon
                    className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                    icon="info"
                  />
                  <div className="pl3 flex-auto">
                    <span className="f5 db white">Privacy</span>
                    <span className="f7 db white-70">
                      Privacy Policy & Terms of Service
                    </span>
                  </div>
                </Link>
                {props.showInstall && (
                  <div
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim pointer"
                    onClick={this.install}
                  >
                    <FeatherIcon
                      className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                      icon="grid"
                    />
                    <div className="pl3 flex-auto">
                      <span className="f5 db white">Install Athares</span>
                      <span className="f7 db white-70">
                        Add Athares to Homescreen or Desktop
                      </span>
                    </div>
                  </div>
                )}
                {/* <Link
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                    to="/contact"
                >
                    <FeatherIcon
                        className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                        icon="at-sign"
                    />
                    <div className="pl3 flex-auto">
                        <span className="f5 db white">Contact Us</span>
                        <span className="f7 db white-70">Report an issue</span>
                    </div>
                </Link> */}
                {user && (
                  <div
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                    onClick={this.logoutUser}
                  >
                    <FeatherIcon
                      className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                      icon="log-out"
                    />
                    <div className="pl3 flex-auto">
                      <span className="f5 db white">Log Out</span>
                    </div>
                  </div>
                )}
              </ul>
            </Menu>
          );
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: pull(state, "user"),
    showInstall: pullUI(state, "showInstall")
  };
}
export default connect(mapStateToProps)(MenuWrapper);
