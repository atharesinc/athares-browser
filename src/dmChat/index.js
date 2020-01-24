import React, { Component, withGlobal } from 'reactn';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import DMSettings from './DMSettings';
import AtharesLoader from '../components/AtharesLoader';
import { ChevronLeft, MoreVertical } from 'react-feather';
import { Link } from 'react-router-dom';

import { decrypt } from 'utils/crypto';
import SimpleCrypto from 'simple-crypto-js';
import { CREATE_MESSAGE } from '../graphql/mutations';
import {
  GET_MESSAGES_FROM_CHANNEL_ID,
  GET_USER_KEYS,
} from '../graphql/queries';
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from '../graphql/subscriptions';
import { graphql, Query } from 'react-apollo';
import compose from 'lodash.flowright';
import { uploadToAWS } from 'utils/upload';
import swal from 'sweetalert';

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptoEnabled: false,
      text: '',
      uploadInProgress: false,
    };
    this.simpleCrypto = new SimpleCrypto('nope');
  }

  async componentDidMount() {
    if (this.props.user === null) {
      this.props.history.replace('/app');
    }
    const { unreadDMs } = this.global;

    // Make sure activeChannel is set
    if (
      this.props.activeChannel === null ||
      this.props.activeChannel !== this.props.match.params.id
    ) {
      this.setGlobal({ activechannel: this.props.match.params.id });
    }
    // see this channel
    if (this.props.activeChannel) {
      const index = unreadDMs.indexOf(this.props.activeChannel);
      this.setGlobal({ unreadDMs: unreadDMs.splice(index) });
    }

    if (this.props.getUserKeys.User) {
      try {
        let hashed = window.localStorage.getItem('ATHARES_HASH');
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);
        const userPriv = simpleCryptoForUserPriv.decrypt(
          this.props.getUserKeys.User.priv,
        );

        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          userPriv,
        );

        this.simpleCrypto.setSecret(decryptedChannelSecret);
        this.setState({
          cryptoEnabled: true,
        });
      } catch (err) {
        console.error(new Error(err));
      }
    }
  }

  doesUserBelong = () => {
    if (typeof this.props.getUserKeys.User.keys[0] === 'undefined') {
      this.props.history.replace('/app');
    }
  };
  async componentDidUpdate(prevProps) {
    if (
      this.props.activeChannel &&
      this.props.activeChannel !== prevProps.activeChannel
    ) {
      const { unreadDMs } = this.global;
      const index = unreadDMs.indexOf(this.props.activeChannel);
      this.setGlobal({ unreadDMs: unreadDMs.splice(index) });
    }

    if (prevProps.getUserKeys.User !== this.props.getUserKeys.User) {
      this.doesUserBelong();
      try {
        let hashed = window.localStorage.getItem('ATHARES_HASH');
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);

        let userPriv = simpleCryptoForUserPriv.decrypt(
          this.props.getUserKeys.User.priv,
        );

        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          userPriv,
        );

        this.simpleCrypto.setSecret(decryptedChannelSecret);
        this.setState({
          cryptoEnabled: true,
        });
      } catch (err) {
        if (err.message.includes("Cannot read property 'key' of undefined")) {
          // user doesn't belong to this dm
          return;
        }
        console.error(new Error(err));
      }
    }
  }

  scrollToBottom = () => {
    let chatBox = document.getElementById('chat-window-scroller');
    if (chatBox) {
      /* scroll to bottom */
      chatBox = chatBox.firstElementChild;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  submit = async (text, file = null) => {
    if (text.trim() === '' && file === null) {
      return false;
    }
    if (file) {
      await this.setState({
        uploadInProgress: true,
      });
    }
    let { user, activeChannel: channel } = this.props;
    try {
      let url = file === null ? null : await uploadToAWS(file);

      // create the message, encrypted with the channel's key
      let newMessage = {
        text: this.simpleCrypto.encrypt(text.trim()),
        user,
        channel,
        file: url ? this.simpleCrypto.encrypt(url.url) : '',
        fileName: file !== null ? file.name : null,
      };
      this.props.createMessage({
        variables: {
          ...newMessage,
        },
      });

      await this.setState({
        uploadInProgress: false,
      });
      /* clear textbox */
      let chatInput = document.getElementById('chat-input');
      chatInput.value = '';
      chatInput.setAttribute('rows', 1);
      // this.scrollToBottom();
    } catch (err) {
      this.setState({
        uploadInProgress: false,
      });
      console.error(new Error(err));
      swal(
        'Error',
        'We were unable to send your message, please try again later',
        'error',
      );
    }
  };

  updateChannel = () => {
    this.setGlobal({ activeChannel: null });
  };

  normalizeName = name => {
    let retval = name
      .split(', ')
      .filter(
        n =>
          n !==
          this.props.getUserKeys.User.firstName +
            ' ' +
            this.props.getUserKeys.User.lastName,
      );
    if (retval.length === 0) {
      return name;
    }
    if (retval.length < 3) {
      return retval.join(' & ');
    }
    if (retval.length < 6) {
      retval = [
        ...retval.splice(0, retval.length - 1),
        ['and', retval[retval.length - 1]].join(' '),
      ];
      retval = retval.join(', ');
      return retval;
    }
    retval = [...retval.splice(0, 4), '...and ' + retval.length + ' more'];
    retval = retval.join(', ');
    return retval;
  };
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_MESSAGES_BY_CHANNEL_ID,
      variables: { id: this.props.activeChannel || '' },
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

  showDMSettings = () => {
    this.setGlobal({
      dmSettings: true,
    });
  };

  render() {
    let { getUserKeys } = this.props;
    let channel = null,
      messages = [],
      user = null;
    return (
      <Query
        query={GET_MESSAGES_FROM_CHANNEL_ID}
        variables={{ id: this.props.activeChannel || '' }}
        onCompleted={this.scrollToBottom}
      >
        {({ data = {}, subscribeToMore }) => {
          if (data.channel) {
            this._subToMore(subscribeToMore);
            channel = data.channel;
            messages = data.channel.messages;
          }
          if (getUserKeys.User) {
            user = getUserKeys.User;
          }

          if (channel && messages && user && this.state.cryptoEnabled) {
            messages = messages.map(m => ({
              ...m,
              text: this.simpleCrypto.decrypt(m.text),
              file: m.file ? this.simpleCrypto.decrypt(m.file) : null,
            }));

            return (
              <div id='chat-wrapper'>
                <div id='current-dm-channel'>
                  <Link to='/app'>
                    <ChevronLeft className='white db dn-ns' />
                  </Link>
                  <div>{this.normalizeName(channel.name)}</div>
                  <MoreVertical
                    className='white db pointer'
                    onClick={this.showDMSettings}
                  />
                </div>
                {messages.length !== 0 ? (
                  <ChatWindow messages={messages} user={user} />
                ) : (
                  <AtharesLoader />
                )}
                <ChatInput
                  submit={this.submit}
                  uploadInProgress={this.state.uploadInProgress}
                />
                {this.global.dmSettings && <DMSettings />}
              </div>
            );
          } else {
            return (
              <div id='chat-wrapper' style={{ justifyContent: 'center' }}>
                <AtharesLoader />
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

export default withGlobal(({ user, activeChannel }) => ({
  activeChannel,
  user,
}))(
  compose(
    graphql(CREATE_MESSAGE, { name: 'createMessage' }),
    graphql(GET_USER_KEYS, {
      name: 'getUserKeys',
      options: ({ user, activeChannel }) => ({
        variables: { user: user, channel: activeChannel },
      }),
    }),
  )(DMChat),
);
