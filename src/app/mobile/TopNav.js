import React, { Component } from "react";

import FeatherIcon from "feather-icons-react";

const TopNav = props => (
  <div
    className="w-100 v-mid bg-theme-dark flex flex-row justify-between items-center pv2 ph3"
    style={{ height: "3em" }}
  >
    <img
      src={window.location.origin + "/img/user-default.png"}
      className="ba b--white br-100 w2 h2 bw1"
      alt="Menu"
      onClick={props.toggleMenu}
    />

    <FeatherIcon
      icon="search"
      className="white w2 h2"
      style={{ height: "1.5em", width: "1.5em" }}
    />
  </div>
);

export default TopNav;
