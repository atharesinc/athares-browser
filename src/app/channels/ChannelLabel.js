import React from "react";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

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
    const shouldRenderAddChannel = () => {
        if (
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
            return (
                <Link to={`/app/circle/${props.id || "232323"}/new/channel`}>
                    <FeatherIcon icon="plus" className="dim" />
                </Link>
            );
        }
        return null;
    };
    const setActiveChannel = () => {
        if (props.isTop) {
            return false;
        }
        const thisChannel = {
            id: props.id,
            name: props.name,
            circle_id: props.circle_id
        };
        console.log(thisChannel);
    };
    const active =
        props.activeChannel && props.activeChannel.id === props.id
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

const ChannelLabelWithRouter = withRouter(ChannelLabel);
export default ChannelLabelWithRouter;
