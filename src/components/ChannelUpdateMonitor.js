import React, { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";
import { GET_DMS_BY_USER } from "../graphql/queries";
import { SUB_TO_DMS_BY_USER } from "../graphql/subscriptions";
import { Query, graphql } from "react-apollo";
import { updateDMs, addUnreadDM } from "../store/state/actions";

class ChannelUpdateMonitor extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.getDMs.User &&
      this.props.getDMs.User !== prevProps.getDMs.User
    ) {
      let { channels } = this.props.getDMs.User;
      let dms = channels.map(c => c.id);
      // set the user's current DMs
      this.props.dispatch(updateDMs(dms));
    }
  }
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_DMS_BY_USER,
      variables: { ids: this.props.dms || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (this.props.activeChannel === updatedChannel) {
          return prev;
        } else {
          if (this.props.dms.findIndex(dm => dm === updatedChannel) !== -1) {
            this.props.dispatch(addUnreadDM(updatedChannel));
            // also notify user later when notifications make more sense
            //   this.notifyUserAPIOrMaybeNot()
          }
          return prev;
        }
      }
    });
  };
  render() {
    return (
      <Query query={GET_DMS_BY_USER} variables={{ id: this.props.user || "" }}>
        {({ subscribeToMore }) => {
          if (this.props.getDMs.User) {
            this._subToMore(subscribeToMore);
          }
          return null;
        }}
      </Query>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel"),
    dms: pull(state, "dms")
  };
}
export default connect(mapStateToProps)(
  graphql(GET_DMS_BY_USER, {
    name: "getDMs",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(ChannelUpdateMonitor)
);
