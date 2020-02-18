import React, { withGlobal, useGlobal, useEffect } from 'reactn';
import ChannelGroup from './ChannelGroup';
import GovernanceChannelGroup from './GovernanceChannelGroup';
import { Link } from 'react-router-dom';
import DMList from './DMList';

import BottomNav from '../components/BottomNav';
import { MoreVertical } from 'react-feather';
import {
  GET_CHANNELS_BY_CIRCLE_ID,
  IS_USER_IN_CIRCLE,
} from '../graphql/queries';
import { SUB_TO_CIRCLES_CHANNELS } from 'graphql/subscriptions';

import { Query, graphql } from 'react-apollo';
import compose from 'lodash.flowright';

import Search from '../search';
import Scrollbars from 'react-custom-scrollbars';

function Channels(props) {
  const [activeChannel, setActiveCircle] = useGlobal('activeChannel');
  const [unreadChannels] = useGlobal('unreadChannels');

  useEffect(() => {
    if (/\/app\/circle\/.{25}$/.test(props.location.pathname)) {
      let match = /\/app\/circle\/(.{25})$/.exec(props.location.pathname);
      setActiveCircle(match[1]);
    }
  }, [props.location.pathname, setActiveCircle]);

  useEffect(() => {
    if (/\/app\/circle\/.{25}$/.test(props.location.pathname)) {
      let match = /\/app\/circle\/(.{25})$/.exec(props.location.pathname)[1];
      if (match !== props.activeCircle) {
        setActiveCircle(match);
      }
    }
  }, [props.location.pathname, props.activeCircle, setActiveCircle]);

  const goToOptions = () => {
    props.history.push(`/app/circle/${props.activeCircle}/settings`);
  };

  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_CIRCLES_CHANNELS,
      variables: { id: props.activeCircle || '' },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        let newChannel = subscriptionData.data.channel.node;
        if (!prev.Circle.channels.find(c => c.id === newChannel.id)) {
          return {
            Circle: {
              ...prev.Circle,
              channels: [...prev.Circle.channels, newChannel],
            },
          };
        } else {
          return prev;
        }
      },
    });
  };

  let { activeCircle, isUserInCircle } = props;

  let belongsToCircle = false;
  const { user } = props;
  let circle = null;
  let channels = [];

  // see if the user actually belongs to this circle
  if (
    isUserInCircle.circlesList &&
    isUserInCircle.circlesList.items.length !== 0 &&
    isUserInCircle.circlesList.items[0].id === activeCircle
  ) {
    belongsToCircle = true;
  }

  const mobile = window.innerWidth < 993;

  return (
    <Query
      query={GET_CHANNELS_BY_CIRCLE_ID}
      variables={{ id: props.activeCircle || '' }}
    >
      {({ data = {}, subscribeToMore }) => {
        if (data.circle) {
          _subToMore(subscribeToMore);
          circle = data.circle;
          channels = circle.channels.items;
          channels = channels.map(ch => ({
            unread: unreadChannels.includes(ch.id),
            ...ch,
          }));
        }
        if (circle) {
          return (
            <div id='channels-wrapper'>
              <div id='circle-name'>
                {circle.name}
                {user && belongsToCircle && (
                  <MoreVertical
                    className='white'
                    onClick={goToOptions}
                    id='circle-options'
                  />
                )}
              </div>

              <div id='channels-list'>
                {!mobile && <Search />}
                <Scrollbars
                  style={{
                    width: '100%',
                    height: mobile ? '80vh' : '100%',
                  }}
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                  universal={true}
                >
                  <GovernanceChannelGroup
                    style={style.docs}
                    name={'Governance'}
                  />
                  <ChannelGroup
                    belongsToCircle={belongsToCircle}
                    style={style.channels}
                    channelType={'group'}
                    activeChannel={activeChannel}
                    name={'Channels'}
                    channels={channels.filter(channel => {
                      return channel.channelType === 'group';
                    })}
                  />
                  <DMList />
                </Scrollbars>
              </div>
              <BottomNav
                loggedIn={!!user}
                belongsToCircle={belongsToCircle}
                activeCircle={activeCircle}
              />
            </div>
          );
        } else {
          return (
            <div id='channels-wrapper'>
              <div id='circle-name'>No Circle Selected</div>

              <div
                id='channels-list'
                style={{
                  alignItems: 'center',
                }}
              >
                {!mobile && <Search />}
                <div className='w-100'>
                  {user ? (
                    <Link to={'/app/new/circle'}>
                      <div className='pv2 ph3 w-100 mt2 white-50 glow'>
                        Select a circle or create one
                      </div>
                    </Link>
                  ) : (
                    <Link to={'/auth'}>
                      <div className='pv2 ph3 w-100'>
                        Welcome to Athares
                        <br />
                        <br />
                        Login or Register to get started.
                      </div>
                    </Link>
                  )}
                </div>
                <DMList />
              </div>
              <BottomNav
                loggedIn={!!user}
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

const style = {
  docs: {
    flex: 1,
  },
  channels: {
    flex: 1,
  },
  dm: {
    flex: 1,
  },
};

export default withGlobal(({ activeCircle, user }) => ({ activeCircle, user }))(
  compose(
    graphql(IS_USER_IN_CIRCLE, {
      name: 'isUserInCircle',
      options: ({ activeCircle, user }) => ({
        variables: { circle: activeCircle || '', user: user || '' },
      }),
    }),
    // ,
    // graphql(GET_DMS_BY_USER, {
    //   name: "getDMsByUser",
    //   options: ({ user }) => ({
    //     // pollInterval: 5000,
    //     variables: { id: user || "" },
    //   }),
    // })
  )(Channels),
);
