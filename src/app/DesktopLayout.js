import React, { Component, Fragment } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
// import { Redirect } from "react-router-dom";
import { withGun } from "../utils/react-gun";
import { connect } from "react-redux";

import Loader from "./Loader";

class DesktopLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
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
    return (
      <div id="app-wrapper-outer" className="wrapper">
        <PushingMenu
          isOpen={this.state.isOpen}
          isMenuOpen={this.isMenuOpen}
          history={this.props.history}
        />
        <div
          className="wrapper"
          id="app-wrapper"
          style={{
            marginLeft: this.state.isOpen ? "calc(30% - 300px)" : ""
          }}
        >
          <Circles {...this.props} toggleMenu={this.toggleMenu} />
          <Channels {...this.props} />
          <Dashboards {...this.props} />
        </div>
      </div>
    );
  }
}

export default DesktopLayout;
