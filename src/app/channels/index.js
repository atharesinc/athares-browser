import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../store/state/reducers";
import BottomNav from "./BottomNav";
import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import {
  GET_CHANNELS_BY_CIRCLE_ID,
  GET_DMS_BY_USER
} from "../../graphql/queries";
import { Query, graphql } from "react-apollo";
import { updateCircle } from "../../store/state/actions";

class Channels extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (/\/app\/circle\/.{25}$/.test(this.props.location.pathname)) {
      let match = /\/app\/circle\/(.{25})$/.exec(this.props.location.pathname);
      this.props.dispatch(updateCircle(match[1]));
    }
  }
  componentDidUpdate(prevProps) {
    if (/\/app\/circle\/.{25}$/.test(this.props.location.pathname)) {
      let match = /\/app\/circle\/(.{25})$/.exec(
        this.props.location.pathname
      )[1];
      if (match !== this.props.activeCircle) {
        this.props.dispatch(updateCircle(match));
      }
    }
  }
  goToOptions = () => {
    this.props.history.push(`/app/circle/${this.props.activeCircle}/leave`);
  };
  render() {
    let { activeChannel, user, activeCircle, getDMsByUser } = this.props;
    let mobile = window.innerWidth < 993 ? false : true;
    let circle = null;
    let channels = [];
    let dms = [];
    if (getDMsByUser.User && getDMsByUser.User.channels) {
      dms = getDMsByUser.User.channels;
    }
    return (
      <Query
        query={GET_CHANNELS_BY_CIRCLE_ID}
        variables={{ id: this.props.activeCircle || "" }}
        pollInterval={3000}
      >
        {({ loading, err, data }) => {
          if (data.Circle) {
            circle = data.Circle;
            channels = circle.channels;
          }
          if (circle) {
            return (
              <div id="channels-wrapper">
                <div id="circle-name">
                  {circle.name}
                  {user && (
                    <FeatherIcon
                      icon="more-vertical"
                      className="white"
                      onClick={this.goToOptions}
                      id="circle-options"
                    />
                  )}
                </div>
                <div id="channels-list">
                  {/* <Scrollbars
                    style={{
                      // width: "100%",
                      // height: "100%",
                      overflow: "none"
                    }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}
                  > */}
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
                    channels={dms}
                  />
                  {/* </Scrollbars> */}
                </div>
                <BottomNav show={!!user} activeCircle={activeCircle} />
              </div>
            );
          } else {
            return (
              <div id="channels-wrapper">
                <div id="circle-name">No Circle Selected</div>
                <div
                  id="channels-list"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center"
                  }}
                >
                  <div className="w-100">
                    {user ? (
                      <Link to={"/app/new/circle"}>
                        <div className="pv2 ph3 w-100 mt2 white-50 glow">
                          Select a circle or create one
                        </div>
                      </Link>
                    ) : (
                      <Link to={"/login"}>
                        <div className="pv2 ph3 w-100">
                          Welcome to Athares
                          <br />
                          <br />
                          Login or Register to get started.
                        </div>
                      </Link>
                    )}
                  </div>
                  <ChannelGroup
                    style={style.dm}
                    channelType={"dm"}
                    activeChannel={activeChannel}
                    name={"Direct Messages"}
                    channels={dms}
                  />
                </div>
                <BottomNav show={!!user} activeCircle={activeCircle} />
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

const style = {
  docs: {
    flex: 1
  },
  channels: {
    flex: 1
  },
  dm: {
    flex: 1
  }
};

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeCircle: pull(state, "activeCircle"),
    activeChannel: pull(state, "activeChannel")
  };
}

export default connect(mapStateToProps)(
  graphql(GET_DMS_BY_USER, {
    name: "getDMsByUser",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(Channels)
);
