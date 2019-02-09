import React from "react";

const GovernanceChannelLabel = props => {
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
  const active =
    props.activeChannel && props.activeChannel._id === props._id
      ? "active-bg"
      : "";
  return (
    <div
      className={`channel-group-label ${active}`}
      onClick={setActiveChannel}
      style={hasBorder(props.name)}
    >
      <div>{props.name}</div>
      {shouldRenderAddChannel()}
    </div>
  );
};

export default GovernanceChannelLabel;
