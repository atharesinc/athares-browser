import React from "react";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { getActiveCircle } from "../../graphql/queries";
import { compose, graphql } from "react-apollo";
import { setActiveChannel } from "../../graphql/mutations";

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
                <Link to={`/app/circle/${id}/new/channel`}>
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
        console.log(props.match);

        props.setActiveChannel({ variables: { id: props.id } });
        props.history.push(
            `/app/circle/${props.getActiveCircle.activeCircle.id}/channel/${
                props.id
            }`
        );
    };
    const active =
        props.activeChannel && props.activeChannel.id === props.id
            ? "active-bg"
            : "";
    const { error, loading, activeCircle: { id } } = props.getActiveCircle;
    if (error || loading) {
        return null;
    }
    return (
        <div
            className={`channel-group-label ${active} ${
                !["Channels", "Governance", "Direct Messages"].includes(
                    props.name
                )
                    ? "channel-wrapper"
                    : ""
            }`}
            onClick={setActiveChannel}
            style={hasBorder(props.name)}
        >
            <div>{props.name}</div>
            {shouldRenderAddChannel(id)}
        </div>
    );
};

const ChannelLabelWithRouter = withRouter(ChannelLabel);
export default compose(
    graphql(getActiveCircle, { name: "getActiveCircle" }),
    graphql(setActiveChannel, { name: "setActiveChannel" })
)(ChannelLabelWithRouter);
