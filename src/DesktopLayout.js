import React, { useState  } from "reactn";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";


function DesktopLayout (){
  
    state = {
      isOpen: false,
      user: null
    };
  
  const toggleMenu = () => {
    setState({
      isOpen: !isOpen
    });
  };
  const isMenuOpen = state => {
    setState({
      isOpen: state.isOpen
    });
  };
  
    return (
      <div id="app-wrapper-outer" className="wrapper">
        <PushingMenu
          isOpen={isOpen}
          isMenuOpen={isMenuOpen}
          history={props.history}
          toggleMenu={toggleMenu}
        />
        <div
          className="wrapper"
          id="app-wrapper"
          style={{
            marginLeft: isOpen ? "calc(30% - 300px)" : ""
          }}
        >
          <Circles {...props} toggleMenu={toggleMenu} />
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
