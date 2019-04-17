import React from "react";
import { Link } from "react-router-dom";
import { pull } from "../../store/state/reducers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

/*
    A Group of Governance Channels
    */
const GovernanceChannelGroup = ({ activeCircle, location, ...props }) => {
  const docsActive = /circle\/.+\/(constitution)/.test(location.pathname);
  const revActive = /circle\/.+\/(revisions)/.test(location.pathname);
  const newsActive = /circle\/.+\/(news)/.test(location.pathname);
  return (
    <div className="channel-group-wrapper">
      <div
        className={`channel-group-label ttu tracked f7`}
        style={{ color: "#FFFFFF", lineHeight: "2rem" }}
      >
        {props.name}
      </div>

      <Link to={`/app/circle/${activeCircle}/constitution`}>
        <div
          className={`channel-group-label white-50 ${
            docsActive ? "active-bg" : ""
          }`}
          style={{ borderBottom: "none" }}
        >
          Constitution
        </div>
      </Link>
      <Link to={`/app/circle/${activeCircle}/revisions`}>
        <div
          className={`channel-group-label white-50 ${
            revActive ? "active-bg" : ""
          }`}
          style={{ borderBottom: "none" }}
        >
          Polls
        </div>
      </Link>
      <Link to={`/app/circle/${activeCircle}/news`}>
        <div
          className={`channel-group-label white-50 ${
            newsActive ? "active-bg" : ""
          } flex flex-row justify-between items center`}
          style={{ borderBottom: "none" }}
        >
          <div>News</div>
          <div
            className="bg-theme-light br-pill pv1 ph2"
            style={{ textIndent: "initial" }}
          >
            Coming Soon
          </div>
        </div>
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
