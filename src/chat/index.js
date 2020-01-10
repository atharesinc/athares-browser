import React, { useState, useEffect, useGlobal } from 'reactn';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import AtharesLoader from '../components/AtharesLoader';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

import { CREATE_MESSAGE } from '../graphql/mutations';
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from '../graphql/subscriptions';
import { GET_MESSAGES_FROM_CHANNEL_ID } from '../graphql/queries';
import { graphql, Query } from 'react-apollo';
import swal from 'sweetalert';
import { uploadToAWS } from 'utils/upload';

function Chat(props) {
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [user] = useGlobal('user');
  const [activeChannel, setActiveChannel] = useGlobal('activeChannel');
  const [, setActiveCircle] = useGlobal('activeCircle');
  const [unreadChannels, setUnreadChannels] = useGlobal('unreadChannels');
  const [, setActiveRevision] = useGlobal('activeRevision');

  useEffect(() => {
    function componentMount() {
      const circleId = props.match.url.match(/app\/circle\/(.+)\/channel/)[1];

      if (circleId) {
        setActiveCircle(circleId);
      }

      if (!activeChannel) {
        setActiveChannel(props.match.params.id);
        setActiveRevision(null);
        return;
      }
      // // remove this channel from list of channels with unread messages
      if (unreadChannels.indexOf(activeChannel) !== -1) {
        const index = unreadChannels.findIndex(
          item => item.id === props.match.params.id,
        );

        setUnreadChannels(unreadChannels.splice(index));
      }
      // may need to make this activeChannel
    }
    componentMount();
  }, [
    props.match.url,
    setActiveCircle,
    activeChannel,
    setActiveRevision,
    unreadChannels,
    setActiveChannel,
    setUnreadChannels,
    props.match.params.id,
  ]);

  // useEffect(() => {
  //   // if current url doesn't match internal state, update state to match url
  //   if (props.match.params.id !== props.activeChannel) {
  //     setActiveChannel(props.match.params.id);
  //     // props.dispatch(removeUnreadChannel(props.match.params.id));
  //   }
  //   // const index = unreadChannels.findIndex(
  //   //   item => item.id === props.match.params.id
  //   // );

  //   // setUnreadChannels(unreadChannels.splice(index));
  // }, [
  //   props.match.params.id,
  //   activeChannel,
  //   props.activeChannel,
  //   setActiveChannel
  // ]);

  const scrollToBottom = () => {
    let chatBox = document.getElementById('chat-window-scroller');
    if (chatBox) {
      /* scroll to bottom */
      chatBox = chatBox.firstElementChild;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
  const updateChannel = () => {
    setActiveChannel(null);
  };

  const submit = async (text, file = null) => {
    let chatInput = document.getElementById('chat-input');

    if (file) {
      setUploadInProgress(true);
    }

    try {
      let url = file === null ? null : await uploadToAWS(file);

      if (file) {
        fetch(url);
      }

      let newMessage = {
        text: text.trim(),
        channel: activeChannel,
        user: user,
        file: file !== null ? url.url : null,
        fileName: file !== null ? file.name : null,
      };

      let newMessageRes = await props.createMessage({
        variables: {
          ...newMessage,
        },
      });

      newMessage.id = newMessageRes.data.createMessage.id;

      /* clear textbox */
      chatInput.value = '';
      chatInput.setAttribute('rows', 1);
      setUploadInProgress(false);

      /* scroll to bottom */
      scrollToBottom();
    } catch (err) {
      setUploadInProgress(false);
      console.error(new Error(err));
      swal(
        'Error',
        'We were unable to send your message, please try again later',
        'error',
      );
    }
  };
  const _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_MESSAGES_BY_CHANNEL_ID,
      variables: { id: activeChannel || '' },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        let newMsg = subscriptionData.data.Message.node;
        if (!prev.Channel.messages.find(m => m.id === newMsg.id)) {
          return {
            Channel: {
              ...prev.Channel,
              messages: [...prev.Channel.messages, newMsg],
            },
          };
        } else {
          return prev;
        }
      },
    });
  };

  let channel = null;
  let messages = [];

  return (
    <Query
      query={GET_MESSAGES_FROM_CHANNEL_ID}
      variables={{ id: activeChannel || '' }}
      onCompleted={scrollToBottom}
    >
      {({ data = {}, subscribeToMore }) => {
        if (data.Channel) {
          _subToMore(subscribeToMore);
          channel = data.Channel;
          messages = data.Channel.messages;
        }

        if (channel) {
          return (
            <div id='chat-wrapper'>
              <div id='current-channel'>
                <Link to='/app'>
                  <FeatherIcon
                    icon='chevron-left'
                    className='white db dn-l'
                    onClick={updateChannel}
                  />
                </Link>
                <div>{channel.name}</div>
                <div
                  className='f6 dn db-ns'
                  style={{ background: 'none', color: '#FFFFFF80' }}
                >
                  {channel.description}
                </div>
                {/* <FeatherIcon
                            icon="more-vertical"
                            className="white db dn-ns"
                        /> */}
              </div>
              <ChatWindow messages={messages} user={user} />
              {user && (
                <ChatInput
                  submit={submit}
                  uploadInProgress={uploadInProgress}
                />
              )}
            </div>
          );
        } else {
          return (
            <div id='chat-wrapper' style={{ justifyContent: 'center' }}>
              <AtharesLoader />
              <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>
                Getting Messages
              </h1>
            </div>
          );
        }
      }}
    </Query>
  );
}

export default graphql(CREATE_MESSAGE, { name: 'createMessage' })(Chat);
