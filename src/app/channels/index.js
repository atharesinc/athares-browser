import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import Loader from "../Loader";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as stateSelectors from "../../store/state/reducers";
import { updateChannel } from "../../store/state/actions";
import { withGun } from "../../utils/react-gun";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      circle: null
    };
  }
  componentDidMount() {
    if (this.props.circle) {
      // get this circle's and it's channels
      let channels = [];
      let circle = this.props.gun.get(this.props.circle);

      circle.get("channels").map(channel => {
        channels.push(circle);
      });

      circle.once(c => {
        this.setState({
          channels,
          circle: c
        });
      });
    }
  }
  componentDidUpdate() {
    // if (this.props.getActiveCircle.activeCircle !== undefined) {
    //     this.props.getOneCircle.refetch({
    //         id: this.props.getActiveCircle.activeCircle.id
    //     });
    // }
  }
  render() {
    const { activeChannel, activeCircle, user } = this.props;
    const { circle, channels } = this.state;

    if (activeCircle) {
      return (
        <div id="channels-wrapper">
          <div id="circle-name">
            {circle.name}
            <i className="mdi mdi-plus" id="circle-options" />
          </div>
          <div id="channels-list">
            <GovernanceChannelGroup style={style.docs} name={"Governance"} />
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
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div>
              Select a circle
              {user && <Link to={"/app/new/circle"}> or create one </Link>}
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
