import React, { useState , Fragment } from "reactn";
import TopNav from "./mobile/TopNav";
import Circles from "./mobile/Circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import Search from "./search";
import { Switch, Route, withRouter } from "react-router-dom";

import { pull } from "./store/state/reducers";
import { pull as pullUI } from "./store/ui/reducers";
import { closeSearch, toggleSearch } from "./store/ui/actions";
import { updateCircle } from "./store/state/actions";

function MobileLayout (){
  
    this.state = {
      index: 0,
      menuIsOpen: false
    };
  

  const clickOffSearch = e => {
    if (e.target.className === "modal-mask") {
      props.dispatch(closeSearch());
    }
  };
  const toggleOpenSearch = () => {
    props.dispatch(toggleSearch());
  };
  const toggleMenu = () => {
    this.setState({
      menuIsOpen: !this.state.menuIsOpen
    });
  };
  const isMenuOpen = state => {
    this.setState({
      menuIsOpen: state.menuIsOpen
    });
  };
  const setActive = id => {
    props.dispatch(updateCircle(id));
  };
  
    const { circles, activeCircle, location, searchOpen, user } = props;
    return (
      <div id="app-wrapper-outer" className="wrapper">
        <PushingMenu
          isOpen={this.state.menuIsOpen}
          isMenuOpen={this.isMenuOpen}
          history={props.history}
          user={user}
          toggleMenu={this.toggleMenu}
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
          <TopNav
            toggleMenu={this.toggleMenu}
            hide={
              location.pathname !== "/app" &&
              !/app\/circle\/[a-zA-Z\d]{25}$/.test(location.pathname)
            }
            user={user}
            toggleOpenSearch={this.toggleOpenSearch}
            searchOpen={searchOpen}
          />
          {searchOpen && (
            <div className="modal-mask" onClick={this.clickOffSearch}>
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
                  setActive={this.setActive}
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
                  setActive={this.setActive}
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
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    pub: pull(state, "pub"),
    activeCircle: pull(state, "activeCircle"),
    circles: pull(state, "circles"),
    activeChannel: pull(state, "activeChannel"),
    searchOpen: pullUI(state, "searchOpen")
  };
}

export default withRouter(connect(mapStateToProps)(MobileLayout));

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
