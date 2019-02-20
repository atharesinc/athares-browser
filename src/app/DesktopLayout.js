import React, { PureComponent } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { connect } from "react-redux";

class DesktopLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      user: null
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
          toggleMenu={this.toggleMenu}
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
  return {};
}

export default connect(mapStateToProps)(DesktopLayout);
