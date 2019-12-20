import React, { useState, useGlobal, Fragment } from "reactn";
import TopNav from "./mobile/TopNav";
import Circles from "./mobile/Circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import Search from "./search";
import { Switch, Route, withRouter } from "react-router-dom";

function MobileLayout(props) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [showSearch, setShowSearch] = useGlobal("showSearch");

  const [user] = useState("user");
  const [activeCircle, setActiveCircle] = useState("activeCircle");
  const [circles] = useState("circles");

  const clickOffSearch = e => {
    if (e.target.className === "modal-mask") {
      setShowSearch(false);
    }
  };
  const toggleOpenSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const isMenuOpen = state => {
    setMenuIsOpen(state.menuIsOpen);
  };

  const { location } = props;

  return (
    <div id="app-wrapper-outer" className="wrapper">
      <PushingMenu
        isOpen={menuIsOpen}
        isMenuOpen={isMenuOpen}
        history={props.history}
        user={user}
        toggleMenu={toggleMenu}
      />
      <div
        index={index}
        className="wrapper"
        style={{
          height: "100vh",
          width: "100vw"
        }}
        id="app-wrapper"
      >
        <TopNav
          toggleMenu={toggleMenu}
          hide={
            location.pathname !== "/app" &&
            !/app\/circle\/[a-zA-Z\d]{25}$/.test(location.pathname)
          }
          user={user}
          toggleOpenSearch={toggleOpenSearch}
          showSearch={showSearch}
        />
        {showSearch && (
          <div className="modal-mask" onClick={clickOffSearch}>
            <Search />
          </div>
        )}
        <Switch>
          <Route
            exact
            component={props => (
              <CirclesAndChannels
                activeCircle={activeCircle}
                circles={circles}
                setActive={setActiveCircle}
                user={user}
                {...props}
              />
            )}
            path="/app"
          />
          <Route
            exact
            component={props => (
              <CirclesAndChannels
                activeCircle={activeCircle}
                circles={circles}
                setActive={setActiveCircle}
                user={user}
                {...props}
              />
            )}
            path="/app/circle/:id"
          />
          <Route component={props => <Dashboards {...props} />} />
        </Switch>
      </div>
    </div>
  );
}

export default withRouter(MobileLayout);

const CirclesAndChannels = props => {
  return (
    <Fragment>
      <Circles
        activeCircle={props.activeCircle}
        circles={props.circles}
        setActive={props.setActive}
        user={props.user}
      />
      <Channels {...props} />
    </Fragment>
  );
};
