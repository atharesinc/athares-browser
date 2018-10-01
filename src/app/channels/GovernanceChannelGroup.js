import React from "react";
import { Link } from "react-router-dom";
import { pull } from "../../store/state/reducers";
import { connect } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";

/*
    A Group of Governance Channels
*/
const GovernanceChannelGroup = ({ activeCircle, ...props }) => {
  return (
    <div className="channel-group-wrapper">
      <div className={`channel-group-label`} style={{ color: "#FFFFFF" }}>
        {props.name}
      </div>
      <Scrollbars
        style={{ width: "100%", height: "calc(100vh /5)" }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
      >
        <Link
          to={`/app/circle/${activeCircle}/constitution`}
          className={`channel-group-label gov`}
          style={{ borderBottom: "none", textIndent: "1em" }}
        >
          Constitution
        </Link>
        <Link
          to={`/app/circle/${activeCircle}/revisions`}
          className={`channel-group-label gov`}
          style={{ borderBottom: "none", textIndent: "1em" }}
        >
          Polls
        </Link>
        <Link
          to={`/app/circle/${activeCircle}/news`}
          className={`channel-group-label gov`}
          style={{ borderBottom: "none", textIndent: "1em" }}
        >
          News
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
export default connect(mapStateToProps)(GovernanceChannelGroup);
