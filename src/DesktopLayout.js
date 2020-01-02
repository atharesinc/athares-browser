import React, { useGlobal } from "reactn";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";

function DesktopLayout(props) {
  const [showMenu, setShowMenu] = useGlobal("showMenu");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const isMenuOpen = state => {
    setShowMenu(state.isOpen);
  };

  return (
    <div id="app-wrapper-outer" className="wrapper">
      <PushingMenu
        isOpen={showMenu}
        isMenuOpen={isMenuOpen}
        history={props.history}
        toggleMenu={toggleMenu}
      />
      <div
        className="wrapper"
        id="app-wrapper"
        style={{
          marginLeft: showMenu ? "calc(30% - 300px)" : ""
        }}
      >
        <Circles {...props} toggleMenu={toggleMenu} />
        <Channels {...props} />
        <Dashboards {...props} />
      </div>
    </div>
  );
}

export default DesktopLayout;
