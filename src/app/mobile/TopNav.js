import React from "react";

import FeatherIcon from "feather-icons-react";
import user from "../dashboards/user";

const TopNav = props => (
    <div
        className={`w-100 v-mid bg-theme-dark flex-row justify-between items-center pv2 ph3 ${
            props.hide ? "dn" : "flex"
        }`}
        style={{ height: "3em" }}
    >
        <img
            src={user.icon || "/img/user-default.png"}
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
