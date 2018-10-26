import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../store/state/reducers";
import { updateCircle } from "../../store/state/actions";
import { withGun } from "react-gun";
import BottomNav from "./BottomNav";
import FeatherIcon from "feather-icons-react";

class Channels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: [],
            circle: null
        };
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        
        if(this.props.activeCircle){
            this._isMounted && this.getChannels();
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeCircle !== this.props.activeCircle) {
            if(this.props.activeCircle){ 
                this._isMounted && this.getChannels();
            } else if(this.props.activeCircle === null){
                this._isMounted && this.setState({
                    channels: [],
                    circle: null
                });
            }
        }
    }
    getChannels = () => {
        // faster to filter redux channels that have this circle as parent or just get the channels ?
        // let circle = this.props.circles.find(c => c.id && c.id === circleID);
        // console.log(circle);
        // let channels = this.props.channels.filter(
        //     channel => channel.circle === circleID
        // );
        this.props.gun.get(this.props.activeCircle).open(thisCircle => {
            let {channels, amendments, revisions, users, ...circle} = thisCircle;
            this.setState({
                channels: channels ? Object.values(channels) : [],
                circle
            });
        });
    };
    componentWillUnmount(){
        this._isMounted = false;
    }
    goToOptions = () => {
        this.props.history.push(`/app/circle/${this.props.activeCircle}/leave`);
    }
    render() {
        let {
            activeChannel,
            user,
            // channels,
            activeCircle,
            // circles,
            // dms
        } = this.props;
        let {circle, channels} = this.state;
        // const { circle } = this.state;
        // const circle = circles.find(c => c.id === activeCircle);

        if (circle) {
            // channels = channels.filter(c => c.circle === circle.id);
            return (
                <div id="channels-wrapper">
                    <div id="circle-name">
                        {circle.name}
                            <FeatherIcon
                                icon="more-vertical"
                                className="white"
                                onClick={this.goToOptions}
                                id="circle-options"
                            />                  
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
                        {/* <ChannelGroup
                            style={style.dm}
                            channelType={"dm"}
                            activeChannel={activeChannel}
                            name={"Direct Messages"}
                            channels={dms}
                        /> */}
                    </div>
                    <BottomNav show={!!user} activeCircle={activeCircle} />
                </div>
            );
        } else {
            return (
                <div id="channels-wrapper">
                    <div id="circle-name">
                        No Circle Selected
                    </div>
                    <div
                        id="channels-list"
                        style={{
                            justifyContent: "space-around",
                            alignItems: "center"
                        }}
                    >
                        <div>
                            
                            {user ? 
                                <Link to={"/app/new/circle"}>
                                   Select a circle or create one
                                </Link>
                             :
                             <Link to={"/login"}>
                                   Welcome to Athares
                                   <br/>
                                   <br/>
                                   Login or Register to get started.
                                </Link>
                         }
                        </div>
                        {/*<ChannelGroup
                            style={style.dm}
                            channelType={"dm"}
                            activeChannel={activeChannel}
                            name={"Direct Messages"}
                            channels={dms}
                        />*/}
                    </div>
                    <BottomNav show={!!user} activeCircle={activeCircle} />
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
        channels: pull(state, "channels"),
        dms: pull(state, "dms")
    };
}

export default withGun(connect(mapStateToProps)(Channels));
