import React, { useState  } from "reactn";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";


function DesktopLayout (){
  
    this.state = {
      isOpen: false,
      user: null
    };
  
  const toggleMenu = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
  const isMenuOpen = state => {
    this.setState({
      isOpen: state.isOpen
    });
  };
  
    return (
      <div id="app-wrapper-outer" className="wrapper">
        <PushingMenu
          isOpen={this.state.isOpen}
          isMenuOpen={this.isMenuOpen}
          history={props.history}
          toggleMenu={this.toggleMenu}
        />
        <div
          className="wrapper"
          id="app-wrapper"
          style={{
            marginLeft: this.state.isOpen ? "calc(30% - 300px)" : ""
          }}
        >
          <Circles {...props} toggleMenu={this.toggleMenu} />
          <Channels {...props} />
          <Dashboards {...props} />
        </div>
      </div>
    );
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(DesktopLayout);
