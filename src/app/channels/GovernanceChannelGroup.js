import React from "react";
import { Link } from "react-router-dom";
import { pull } from "../../store/state/reducers";
import { connect } from "react-redux";
import {withRouter} from "react-router-dom";
/*
    A Group of Governance Channels
    */
    const GovernanceChannelGroup = ({ activeCircle,location, ...props }) => {

      const docsActive = /circle\/.+\/(constitution)/.test(location.pathname);
      const revActive = /circle\/.+\/(revisions)/.test(location.pathname);
      const newsActive = /circle\/.+\/(news)/.test(location.pathname);
      return (
        <div className="channel-group-wrapper">
        <div className={`channel-group-label`} style={{ color: "#FFFFFF" }}>
        {props.name}
        </div>
        <Link
        to={`/app/circle/${activeCircle}/constitution`}
        className={`channel-group-label gov ${docsActive ? "active-bg" : ""}`}
        style={{ borderBottom: "none" }}
        >
        Constitution
        </Link>
        <Link
        to={`/app/circle/${activeCircle}/revisions`}
        className={`channel-group-label gov ${revActive ? "active-bg" : ""}`}
        style={{ borderBottom: "none" }}
        >
        Polls
        </Link>
        <Link
        to={`/app/circle/${activeCircle}/news`}
        className={`channel-group-label gov ${newsActive ? "active-bg" : ""}`}
        style={{ borderBottom: "none" }}
        >
        News
        </Link>
        </div>
        );
    };

    function mapStateToProps(state) {
      return {
        activeCircle: pull(state, "activeCircle")
      };
    }
    export default withRouter(connect(mapStateToProps)(GovernanceChannelGroup));
