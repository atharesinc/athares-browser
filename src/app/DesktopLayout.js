import React, { Component, Fragment } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
// import { Redirect } from "react-router-dom";
import { withGun } from "../utils/react-gun";
import { connect } from "react-redux";
import * as stateSelectors from "../store/state/reducers";

import Loader from "./Loader";

class DesktopLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      user: null
    };
  }
  componentDidMount() {
    // get this user's circles
    let userRef = this.props.gun.user(this.props.pub);

    userRef.get("profile").once(user => {
      this.setState({
        user
      });
    });
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
          user={this.state.user}
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

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    pub: stateSelectors.pull(state, "pub")
  };
}

export default connect(mapStateToProps)(withGun(DesktopLayout));
