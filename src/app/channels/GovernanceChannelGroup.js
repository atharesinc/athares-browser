import React from "react";
import { Link } from "react-router-dom";
import { pull } from "../../store/state/reducers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";

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
        className={`channel-group-label`}
        style={{ color: "#FFFFFF", lineHeight: "4rem" }}
      >
        {props.name}
      </div>
      <Scrollbars
        style={{
          width: "100%",
          height: "calc(100vh /3)",
          paddingLeft: "1em"
        }}
        flex={1}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
      >
        <Link to={`/app/circle/${activeCircle}/constitution`}>
          <div
            className={`channel-group-label ${docsActive ? "active-bg" : ""}`}
            style={{ borderBottom: "none" }}
          >
            Constitution
          </div>
        </Link>
        <Link to={`/app/circle/${activeCircle}/revisions`}>
          <div
            className={`channel-group-label ${revActive ? "active-bg" : ""}`}
            style={{ borderBottom: "none" }}
          >
            Polls
          </div>
        </Link>
        <Link to={`/app/circle/${activeCircle}/news`}>
          <div
            className={`channel-group-label ${newsActive ? "active-bg" : ""}`}
            style={{ borderBottom: "none" }}
          >
            <span>News</span>{" "}
            <span className="bg-theme-light br-pill pv1 ph2">Coming Soon</span>
          </div>
        </Link>
      </Scrollbars>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    activeCircle: pull(state, "activeCircle")
  };
}
export default withRouter(connect(mapStateToProps)(GovernanceChannelGroup));
