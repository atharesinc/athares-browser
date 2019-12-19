import React, { useGlobal, withGlobal } from "reactn";

import { GET_ALL_USERS_CIRCLES_CHANNELS } from "../graphql/queries";
import { SUB_TO_ALL_CIRCLES_CHANNELS } from "../graphql/subscriptions";
import { Query, graphql } from "react-apollo";

function ChannelUpdateMonitor(props) {
  const [channels, setChannels] = useGlobal("channels");
  const [unreadChannels, setUnreadChannels] = useGlobal("unreadChannels");
  const [activeChannel] = useGlobal("activeChannel");

  useEffect(() => {
    let { circles } = props.getAllMyChannels.User;
    let channels = circles.map(c => c.channels).flat(1);

    channels = channels.map(c => c.id);
    // set the user's current channels
    setChannels(channels);
  }, [props.getAllMyChannels.User]);

  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_ALL_CIRCLES_CHANNELS,
      variables: { ids: channels || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (subscriptionData.data.Message.node.user.id === props.user) {
          return prev;
        }
        if (activeChannel !== updatedChannel) {
          if (channels.findIndex(ch => ch === updatedChannel) !== -1) {
            setUnreadChannels([...unreadChannels, updatedChannel]);
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
          _subToMore(subscribeToMore);
        }
        return null;
      }}
    </Query>
  );
}
export default withGlobal(({ user }) => ({ user }))(
  graphql(GET_ALL_USERS_CIRCLES_CHANNELS, {
    name: "getAllMyChannels",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(ChannelUpdateMonitor)
);
