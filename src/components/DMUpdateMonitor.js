import React, { useState } from "reactn";

import { pull } from "../store/state/reducers";
import { GET_DMS_BY_USER } from "../graphql/queries";
import { SUB_TO_DMS_BY_USER } from "../graphql/subscriptions";
import { Query, graphql } from "react-apollo";
import { updateDMs, addUnreadDM } from "../store/state/actions";

function ChannelUpdateMonitor (){
  
    this.toggleTitle = null;
  
  componentDidUpdate(prevProps) {
    if (
      props.getDMs.User &&
      props.getDMs.User !== prevProps.getDMs.User
    ) {
      let { channels } = props.getDMs.User;
      let dms = channels.map(c => c.id);
      // set the user's current DMs
      props.dispatch(updateDMs(dms));
    }
    if (
      prevProps.unreadDMs.length > props.unreadDMs.length ||
      props.unreadDMs.length === 0
    ) {
      clearInterval(this.toggleTitle);
      document.title = "Athares Distributed Democracy";
    }
  }
  const playAudio = () => {
    let audio = new Audio("/img/job-done.mp3");
    audio.volume = 0.2;
    audio.play();
  };
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_DMS_BY_USER,
      variables: { ids: props.dms || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (subscriptionData.data.Message.node.user.id === props.user) {
          return prev;
        }
        this.playAudio();
        if (props.activeChannel === updatedChannel) {
          // auditory cue that a new message has been created
          return prev;
        } else {
          if (props.dms.findIndex(dm => dm === updatedChannel) !== -1) {
            props.dispatch(addUnreadDM(updatedChannel));
            // flash title and play sound to get user's attention
            this.flashTab(subscriptionData.data.Message.node.user.firstName);
          }
          return prev;
        }
      }
    });
  };
  const flashTab = firstName => {
    clearInterval(this.toggleTitle);
    let prevTitle = `(${props.unreadDMs.length}) New Message!`;
    let newTitle = `(${
      props.unreadDMs.length
    }) ${firstName} sent a message`;
    document.title = newTitle;

    this.toggleTitle = setInterval(() => {
      switch (document.title) {
        case newTitle:
          document.title = prevTitle;
          break;
        case prevTitle:
          document.title = newTitle;
          break;
        default:
          document.title = prevTitle;
      }
    }, 1500);
    // this.toggleTitle;
  };
  
    return (
      <Query query={GET_DMS_BY_USER} variables={{ id: props.user || "" }}>
        {({ subscribeToMore }) => {
          if (props.getDMs.User) {
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
    dms: pull(state, "dms"),
    unreadDMs: pull(state, "unreadDMs")
  };
}
export default connect(mapStateToProps)(
  graphql(GET_DMS_BY_USER, {
    name: "getDMs",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(ChannelUpdateMonitor)
);
