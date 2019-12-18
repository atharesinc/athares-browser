import React, { useState } from "reactn";

import { pull } from "../store/state/reducers";
import { GET_ALL_USERS_CIRCLES_CHANNELS } from "../graphql/queries";
import { SUB_TO_ALL_CIRCLES_CHANNELS } from "../graphql/subscriptions";
import { Query, graphql } from "react-apollo";
import { updateChannels, addUnreadChannel } from "../store/state/actions";

function ChannelUpdateMonitor (){
  componentDidUpdate(prevProps) {
    if (
      props.getAllMyChannels.User &&
      props.getAllMyChannels.User !== prevProps.getAllMyChannels.User
    ) {
      let { circles } = props.getAllMyChannels.User;
      let channels = circles.map(c => c.channels).flat(1);

      channels = channels.map(c => c.id);
      // set the user's current channels
      props.dispatch(updateChannels(channels));
    }
  }
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_ALL_CIRCLES_CHANNELS,
      variables: { ids: props.channels || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (subscriptionData.data.Message.node.user.id === props.user) {
          return prev;
        }
        if (props.activeChannel !== updatedChannel) {
          if (
            props.channels.findIndex(ch => ch === updatedChannel) !== -1
          ) {
            props.dispatch(addUnreadChannel(updatedChannel));
          }
          return prev;
        }
      }
    });
  };
  
    return (
      <Query
        query={GET_ALL_USERS_CIRCLES_CHANNELS}
        variables={{ id: props.user || "" }}
      >
        {({ subscribeToMore }) => {
          if (props.getAllMyChannels.User) {
            this._subToMore(subscribeToMore);
          }
          return null;
        }}
      </Query>
    );
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel"),
    channels: pull(state, "channels"),
    unreadChannels: pull(state, "unreadChannels")
  };
}
export default connect(mapStateToProps)(
  graphql(GET_ALL_USERS_CIRCLES_CHANNELS, {
    name: "getAllMyChannels",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(ChannelUpdateMonitor)
);
