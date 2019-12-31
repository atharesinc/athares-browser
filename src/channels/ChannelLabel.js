import React, { useGlobal } from "reactn";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const ChannelLabel = props => {
  const [activeCircle] = useGlobal("activeCircle");
  const [activeChannel, setActiveChannel] = useGlobal("activeChannel");
  const [user] = useGlobal("user");

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
      user !== null &&
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

  const setChannel = () => {
    if (props.isTop) {
      return false;
    }
    setActiveChannel(props.id);
    if (props.channelType !== "dm") {
      props.history.push(`/app/circle/${activeCircle}/channel/${props.id}`);
    } else {
      props.history.push(`/app/channel/${props.id}`);
    }
  };

  const active = activeChannel && activeChannel === props.id ? "active-bg" : "";

  return (
    <div
      className={`channel-group-label white-50 ${active} ${
        !["Channels", "Governance", "Direct Messages"].includes(props.name)
          ? "channel-wrapper"
          : "ttu tracked f7"
      }`}
      onClick={setChannel}
      style={hasBorder(props.name)}
    >
      <div>{props.name}</div>
      {shouldRenderAddChannel(activeCircle)}
      {props.unread && (
        <FeatherIcon icon="alert-circle" className="theme-blue h1 popIn" />
      )}
    </div>
  );
};

export default withRouter(ChannelLabel);
