import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import { graphql, compose } from "react-apollo";
import {
    getActiveCircle,
    getOneCircle,
    getActiveChannel
} from "../../graphql/queries";
import Loader from "../Loader";

class Channels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: []
        };
    }
    componentDidMount() {
        this.props.getOneCircle.refetch({
            id: this.props.getActiveCircle.activeCircle.id
        });
    }
    componentDidUpdate() {
        this.props.getOneCircle.refetch({
            id: this.props.getActiveCircle.activeCircle.id
        });
    }
    render() {
        const { error, loading, activeCircle } = this.props.getActiveCircle;
        const { Circle } = this.props.getOneCircle;
        const { activeChannel } = this.props.getActiveChannel;

        if (loading) {
            return (
                <div id="other-circles">
                    <Loader />
                </div>
            );
        } else if (error) {
            return (
                <div id="other-circles">
                    <div>Error</div>
                </div>
            );
        } else if (Circle) {
            return (
                <div id="channels-wrapper">
                    <div id="circle-name">
                        {Circle.name}
                        <i className="mdi mdi-plus" id="circle-options" />
                    </div>
                    <div id="channels-list">
                        <GovernanceChannelGroup
                            style={style.docs}
                            name={"Governance"}
                        />
                        <ChannelGroup
                            style={style.channels}
                            channelType={"group"}
                            activeChannel={activeChannel}
                            name={"Channels"}
                            channels={Circle.channels.filter(channel => {
                                return channel.channelType === "group";
                            })}
                        />
                        <ChannelGroup
                            style={style.dm}
                            channelType={"dm"}
                            activeChannel={activeChannel}
                            name={"Direct Messages"}
                            channels={Circle.channels.filter(channel => {
                                return channel.channelType === "dm";
                            })}
                        />
                    </div>
                </div>
            );
        } else {
            return <div id="channels-wrapper" />;
        }
    }
}

const style = {
    docs: {
        flex: 1
    },
    channels: {
        flex: 3
    },
    dm: {
        flex: 3
    }
};

export default compose(
    graphql(getActiveChannel, { name: "getActiveChannel" }),

    graphql(getActiveCircle, { name: "getActiveCircle" }),
    graphql(getOneCircle, {
        name: "getOneCircle",
        options: ({ id }) => ({ variables: { id: id || "" } })
    })
)(Channels);
