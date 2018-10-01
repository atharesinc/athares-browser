import React, { Component } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const BottomNav = ({ show, activeCircle = null }) => (
  <Link className="w-100" to={show ? "/app/circle/" + activeCircle + "/add/user" : "/login"}>
    <div className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3" style={{ height: "3em" }}>
      <FeatherIcon icon={show ? "plus" : "log-in"} className="white w2 h2 mr3" style={{ height: "1.5em", width: "1.5em" }} />
      <div className="white">{show ? "Invite User to Circle" : "Login or Register"}</div>
    </div>
  </Link>
);
export default BottomNav;
