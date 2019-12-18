import React from "reactn";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import * as stateSelectors from "../store/state/reducers";
import { updateChannel } from "../store/state/actions";


const ChannelLabel = props => {
  const hasBorder = parent_id => {
    switch (parent_id) {
      case "Governance":
        return { color: "#FFFFFF" };
      case "Channels":
        return { color: "#FFFFFF" };
      case "Direct Messages":
        return { color: "#FFFFFF" };
      default:
        return { borderBottom: "none" };
    }
  };
  const shouldRenderAddChannel = id => {
    if (
      props.user !== null &&
      props.name !== "Governance" &&
      props.channelType !== "gov" &&
      !props.id
    ) {
      if (props.channelType === "dm") {
        return (
          <Link to="/app/new/message">
            <FeatherIcon icon="plus" className="dim" />
          </Link>
        );
      }
      if (props.belongsToCircle === true) {
        return (
          <Link to={`/app/circle/${id}/new/channel`}>
            <FeatherIcon icon="plus" className="dim" />
          </Link>
        );
      }
    }
    return null;
  };

  const setActiveChannel = () => {
    if (props.isTop) {
      return false;
    }
    props.dispatch(updateChannel(props.id));
    if (props.channelType !== "dm") {
      props.history.push(
        `/app/circle/${props.activeCircle}/channel/${props.id}`
      );
    } else {
      props.history.push(`/app/channel/${props.id}`);
    }
  };

  const active =
    props.activeChannel && props.activeChannel === props.id ? "active-bg" : "";

  return (
    <div
      className={`channel-group-label white-50 ${active} ${
        !["Channels", "Governance", "Direct Messages"].includes(props.name)
          ? "channel-wrapper"
          : "ttu tracked f7"
      }`}
      onClick={setActiveChannel}
      style={hasBorder(props.name)}
    >
      <div>{props.name}</div>
      {shouldRenderAddChannel(props.activeCircle)}
      {props.unread && (
        <FeatherIcon icon="alert-circle" className="theme-blue h1 popIn" />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    activeCircle: stateSelectors.pull(state, "activeCircle"),
    activeChannel: stateSelectors.pull(state, "activeChannel")
  };
}

export default withRouter(connect(mapStateToProps)(ChannelLabel));
