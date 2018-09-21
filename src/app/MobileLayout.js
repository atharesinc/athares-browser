import React, { Component, Fragment } from "react";
import Loader from "./Loader";

import TopNav from "./mobile/TopNav";
import Circles from "./mobile/Circles";
import BottomNav from "./mobile/BottomNav";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { Switch, Route } from "react-router-dom";

class MobileLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isOpen: false
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
    console.log("trigger");
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
    const atChatWindow =
      /\/app\/channel\/.+/.test(window.location.pathname) ||
      /\/app\/new\/message/.test(window.location.pathname);
    const activeTab = /\/app\/circle/.test(window.location.pathname)
      ? "circles"
      : /\/channel/.test(window.location.pathname)
        ? "channels"
        : /\/app\/user/.test(window.location.pathname)
          ? "user"
          : "app";
    return (
      <div id="app-wrapper-outer" className="wrapper">
        <PushingMenu
          isOpen={this.state.isOpen}
          isMenuOpen={this.isMenuOpen}
          history={this.props.history}
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
              component={props => <CirclesAndChannels />}
              path="/app"
            />
            <Route component={props => <Dashboards {...props} />} />
          </Switch>
          {/* <Switch>
            <Route
              exact
              path="/app/circles"
              component={props => (
                <Circles {...props} toggleMenu={this.toggleMenu} />
              )}
            />
            <Route
              exact
              path="/app/channels"
              component={props => <Channels {...props} />}
            />
            <Route path="/app" component={props => <Dashboards {...props} />} />
          </Switch> */}
          {/* <BottomNav
            toggleMenu={this.toggleMenu}
            show={atChatWindow}
            activeTab={activeTab}
          /> */}
        </div>
      </div>
    );
  }
}

export default MobileLayout;

const CirclesAndChannels = () => (
  <Fragment>
    <Circles activeCircle={"87a6sd9f87"} />
    <Channels />
    <BottomNav />
  </Fragment>
);
