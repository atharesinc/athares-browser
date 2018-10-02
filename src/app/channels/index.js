import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import Loader from "../Loader";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as stateSelectors from "../../store/state/reducers";
import { updateChannel, updateCircle } from "../../store/state/actions";
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
        // get this circle's and it's channels
        let channels = [];
        let circleRef = this.props.gun.get("circles").get(circleID);
        let channelRef = this.props.gun.get("channels");

        circleRef.get("channels").map(channelId => {
            channelRef.get(channelId).once(channel => {
                channels.push(channel);
            });
        });

        // console.log(channels);
        circleRef.once(c => {
            this.setState({
                channels,
                circle: c
            });
        });
    };
    render() {
        const { activeChannel, activeCircle, user } = this.props;
        const { circle, channels } = this.state;

        if (circle) {
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
        user: stateSelectors.pull(state, "user"),
        activeCircle: stateSelectors.pull(state, "activeCircle"),
        activeChannel: stateSelectors.pull(state, "activeChannel")
    };
}

export default withGun(connect(mapStateToProps)(Channels));
