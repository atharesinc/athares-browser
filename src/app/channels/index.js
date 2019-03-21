import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../store/state/reducers";
import BottomNav from "../../components/BottomNav";
import FeatherIcon from "feather-icons-react";
import {
  GET_CHANNELS_BY_CIRCLE_ID,
  GET_DMS_BY_USER,
  IS_USER_IN_CIRCLE
} from "../../graphql/queries";
import { Query, graphql, compose } from "react-apollo";
import { updateCircle } from "../../store/state/actions";
import Search from "../search";
import Scrollbars from "react-custom-scrollbars";

class Channels extends Component {
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
    this.props.history.push(`/app/circle/${this.props.activeCircle}/settings`);
  };
  render() {
    let {
      activeChannel,
      activeCircle,
      getDMsByUser,
      unreadDMs,
      unreadChannels,
      isUserInCircle
    } = this.props;
    let belongsToCircle = false;
    let user = null;
    let circle = null;
    let channels = [];
    let dms = [];
    // get channel data, if any
    if (getDMsByUser.User && getDMsByUser.User.channels) {
      dms = getDMsByUser.User.channels.map(dm => ({
        unread: unreadDMs.includes(dm.id),
        ...dm
      }));
      user = getDMsByUser.User;
      user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName
      };
      // see if the user actually belongs to this circle
      if (
        isUserInCircle.allCircles &&
        isUserInCircle.allCircles.length !== 0 &&
        isUserInCircle.allCircles[0].id === activeCircle
      ) {
        belongsToCircle = true;
      }
    }
    const mobile = window.innerWidth < 993;
    return (
      <Query
        query={GET_CHANNELS_BY_CIRCLE_ID}
        variables={{ id: this.props.activeCircle || "" }}
        pollInterval={3000}
      >
        {({ data }) => {
          if (data.Circle) {
            circle = data.Circle;
            channels = circle.channels;
            channels = channels.map(ch => ({
              unread: unreadChannels.includes(ch.id),
              ...ch
            }));
          }
          if (circle) {
            return (
              <div id="channels-wrapper">
                <div id="circle-name">
                  {circle.name}
                  {user && belongsToCircle && (
                    <FeatherIcon
                      icon="more-vertical"
                      className="white"
                      onClick={this.goToOptions}
                      id="circle-options"
                    />
                  )}
                </div>

                <div id="channels-list">
                  {!mobile && <Search />}
                  <Scrollbars
                    style={{
                      width: "100%",
                      height: mobile ? "80vh" : "100%"
                    }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}
                  >
                    <GovernanceChannelGroup
                      style={style.docs}
                      name={"Governance"}
                    />
                    <ChannelGroup
                      belongsToCircle={belongsToCircle}
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
                      user={user}
                    />
                  </Scrollbars>
                </div>
                <BottomNav
                  show={!!user}
                  belongsToCircle={belongsToCircle}
                  activeCircle={activeCircle}
                />
              </div>
            );
          } else {
            return (
              <div id="channels-wrapper">
                <div id="circle-name">No Circle Selected</div>

                <div
                  id="channels-list"
                  style={{
                    alignItems: "center"
                  }}
                >
                  {!mobile && <Search />}
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
                    user={user}
                  />
                </div>
                <BottomNav
                  show={!!user}
                  belongsToCircle={belongsToCircle}
                  activeCircle={activeCircle}
                />
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
    activeChannel: pull(state, "activeChannel"),
    unreadDMs: pull(state, "unreadDMs"),
    unreadChannels: pull(state, "unreadChannels")
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(IS_USER_IN_CIRCLE, {
      name: "isUserInCircle",
      options: ({ activeCircle, user }) => ({
        variables: { circle: activeCircle || "", user: user || "" }
      })
    }),
    graphql(GET_DMS_BY_USER, {
      name: "getDMsByUser",
      options: ({ user }) => ({
        pollInterval: 5000,
        variables: { id: user || "" }
      })
    })
  )(Channels)
);
