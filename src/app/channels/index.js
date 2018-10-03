import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../store/state/reducers";
import { updateCircle } from "../../store/state/actions";
import { withGun } from "react-gun";

class Channels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: [],
            circle: null
        };
    }
    componentDidMount() {
        this.getChannels();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeCircle !== this.props.activeCircle) {
            this.getChannels();
        }
    }
    getChannels = () => {
        let circleID;
        if (this.props.activeCircle) {
            circleID = this.props.activeCircle;
        } else if (/circle\/(\w+)/.test(this.props.location.pathname)) {
            circleID = /circle\/(\w+)/.exec(this.props.location.pathname)[1];
            this.props.dispatch(updateCircle(circleID));
            return false;
        }

        // faster to filter redux channels that have this circle as parent or just get the channels
        let circle = this.props.circles.find(c => c.id && c.id === circleID);
        let channels = this.props.channels.filter(
            channel => channel.circle === circleID
        );
        this.setState({
            channels,
            circle
        });
    };
    render() {
        let {
            activeChannel,
            user,
            channels,
            activeCircle,
            circles
        } = this.props;
        // const { circle } = this.state;
        const circle = circles.find(c => c.id === activeCircle);

        if (circle) {
            channels = channels.filter(c => c.circle === circle.id);
            return (
                <div id="channels-wrapper">
                    <div id="circle-name">
                        {circle.name}
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
                            channels={channels.filter(channel => {
                                return channel.channelType === "group";
                            })}
                        />
                        <ChannelGroup
                            style={style.dm}
                            channelType={"dm"}
                            activeChannel={activeChannel}
                            name={"Direct Messages"}
                            channels={channels.filter(channel => {
                                return channel.channelType === "dm";
                            })}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div id="channels-wrapper">
                    <div id="circle-name">
                        No Circle Selected
                        <i className="mdi mdi-plus" id="circle-options" />
                    </div>
                    <div
                        id="channels-list"
                        style={{
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            Select a circle
                            {user && (
                                <Link to={"/app/new/circle"}>
                                    {" "}
                                    or create one{" "}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            );
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

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle"),
        activeChannel: pull(state, "activeChannel"),
        circles: pull(state, "circles"),
        channels: pull(state, "channels")
    };
}

export default withGun(connect(mapStateToProps)(Channels));
