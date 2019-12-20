import React, { useGlobal, withGlobal, useEffect } from "reactn";

import { GET_DMS_BY_USER } from "../graphql/queries";
import { SUB_TO_DMS_BY_USER } from "../graphql/subscriptions";
import { Query, graphql } from "react-apollo";

function ChannelUpdateMonitor(props) {
  let toggleTitle = null;
  const [activeChannel] = useGlobal("activeChannel");
  const [dms, setDms] = useGlobal("dms");
  const [unreadDMs, setUnreadDMs] = useGlobal("unreadDMs");

  useEffect(() => {
    let { channels } = props.getDMs.User;
    let dms = channels.map(c => c.id);
    // set the user's current DMs
    setDms(dms);

    if (unreadDMs.length > unreadDMs.length || unreadDMs.length === 0) {
      clearInterval(toggleTitle);
      document.title = "Athares Distributed Democracy";
    }
  }, [props.getDMs.User, unreadDMs]);

  const playAudio = () => {
    let audio = new Audio("/img/job-done.mp3");
    audio.volume = 0.2;
    audio.play();
  };

  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_DMS_BY_USER,
      variables: { ids: dms || [] },
      updateQuery: (prev, { subscriptionData }) => {
        let updatedChannel = subscriptionData.data.Message.node.channel.id;
        if (subscriptionData.data.Message.node.user.id === props.user) {
          return prev;
        }
        playAudio();
        if (activeChannel === updatedChannel) {
          // auditory cue that a new message has been created
          return prev;
        } else {
          if (dms.findIndex(dm => dm === updatedChannel) !== -1) {
            setUnreadDMs([...unreadDMs, updatedChannel]);
            // flash title and play sound to get user's attention
            flashTab(subscriptionData.data.Message.node.user.firstName);
          }
          return prev;
        }
      }
    });
  };
  const flashTab = firstName => {
    clearInterval(toggleTitle);
    let prevTitle = `(${unreadDMs.length}) New Message!`;
    let newTitle = `(${unreadDMs.length}) ${firstName} sent a message`;
    document.title = newTitle;

    toggleTitle = setInterval(() => {
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
    // toggleTitle;
  };

  return (
    <Query query={GET_DMS_BY_USER} variables={{ id: props.user || "" }}>
      {({ subscribeToMore }) => {
        if (props.getDMs.User) {
          _subToMore(subscribeToMore);
        }
        return null;
      }}
    </Query>
  );
}
export default withGlobal(({ user }) => ({ user }))(
  graphql(GET_DMS_BY_USER, {
    name: "getDMs",
    options: ({ user }) => ({ variables: { id: user || "" } })
  })(ChannelUpdateMonitor)
);
