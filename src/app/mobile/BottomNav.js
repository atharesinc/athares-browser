import React, { Component } from "react";

import FeatherIcon from "feather-icons-react";

const BottomNav = props => (
  <div
    className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3"
    style={{ height: "3em" }}
  >
    <FeatherIcon
      icon="plus"
      className="white w2 h2 mr3"
      style={{ height: "1.5em", width: "1.5em" }}
    />
    <div className="white">Invite User</div>
  </div>
);
export default BottomNav;
