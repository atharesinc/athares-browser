import React, { useGlobal } from 'reactn';
import ChannelGroup from './ChannelGroup';
import { Query } from 'react-apollo';
import { GET_DMS_BY_USER } from '../graphql/queries';
import { SUB_TO_DM_CHANNELS } from 'graphql/subscriptions';

export default function DMList(props) {
  const [user] = useGlobal('user');
  const [activeChannel] = useGlobal('activeChannel');
  const [unreadDMs] = useGlobal('unreadDMs');

  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_DM_CHANNELS,
      variables: { id: user || '' },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const { Channel } = subscriptionData.data;
        let newChannel = Channel.node;

        const index = prev.User.channels.findIndex(c => c.id === newChannel.id);

        if (Channel.mutation === 'CREATED') {
          // did we already add this channel? If so, return prev
          if (index !== -1) {
            return prev;
          }

          return {
            User: {
              ...prev.User,
              channels: [...prev.User.channels, newChannel],
            },
          };
        }

        if (Channel.mutation === 'UPDATED') {
          // has the user been removed from this channel (it no loner appears as a channel belonging to them)
          if (index === -1) {
            return {
              User: {
                ...prev.User,
                channels: prev.User.channels.splice(index),
              },
            };
          }

          const newArr = prev.User.channels;
          newArr[index] = newChannel;
          return {
            User: {
              ...prev.User,
              channels: newArr,
            },
          };
        }
        return prev;
      },
    });
  };

  return (
    <Query query={GET_DMS_BY_USER} variables={{ id: user || '' }}>
      {({ data = {}, subscribeToMore }) => {
        _subToMore(subscribeToMore);

        let userObj = null;
        let dms = [];
        // get channel data, if any
        if (data.user && data.user.channels.items) {
          dms = data.user.channels.items.map(dm => ({
            unread: unreadDMs.includes(dm.id),
            ...dm,
          }));
          userObj = data.user;
          userObj = {
            id: userObj.id,
            firstName: userObj.firstName,
            lastName: userObj.lastName,
          };
        }
        return (
          <ChannelGroup
            style={style.dm}
            channelType={'dm'}
            activeChannel={activeChannel}
            name={'Direct Messages'}
            channels={dms}
            user={userObj}
          />
        );
      }}
    </Query>
  );
}

const style = {
  dm: {
    flex: 1,
  },
};
