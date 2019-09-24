import React, { Component } from 'react';
import ChatWindow from '../../../components/ChatWindow';
import ChatInput from '../../../components/ChatInput';
import DMInviteList from './DMInviteList';
import { Link, withRouter } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { pull } from '../../../store/state/reducers';
import { connect } from 'react-redux';
import { encrypt } from '../../../utils/crypto';
import SimpleCrypto from 'simple-crypto-js';
import { GET_USER_BY_ID } from '../../../graphql/queries';
import {
  CREATE_CHANNEL,
  CREATE_KEY,
  CREATE_MESSAGE,
  ADD_USER_TO_CHANNEL,
} from '../../../graphql/mutations';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright'
import { uploadToAWS } from 'utils/upload';
import swal from 'sweetalert';

class CreateDM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      selectedUsers: [],
      cryptoEnabled: false,
      uploadInProgress: false,
    };
  }
  componentDidMount() {
    if (!this.props.user) {
      this.props.history.push('/app');
    }
    document.getElementById('no-messages').innerText =
      "Enter a user's name to start a conversation";
  }
  updateList = items => {
    this.setState({
      selectedUsers: items,
    });
  };
  updateText = text => {
    this.setState({
      text,
    });
  };

  submit = async (text = '', file = null) => {
    let { selectedUsers } = this.state;
    let { data } = this.props;
    if (!data.User) {
      return false;
    }
    // We're going to allow users to have no recipients because they always get added to a channel on creation
    // This defaults to a "just you" channel but they can later add users if they like
    // if (selectedUsers.length === 0) {
    //   return false;
    // }
    // if the user addresses themselves, remove them because they'll get added anyway
    let userIndex = selectedUsers.findIndex(u => u.id === this.props.user);
    if (userIndex !== -1) {
      selectedUsers.splice(userIndex, 1);
    }
    if (text.trim().length === 0 && file === null) {
      return false;
    }
    await this.setState({
      uploadInProgress: true,
    });
    let { User: user } = this.props.data;

    // create a symmetric key for the new channel
    var _secretKey = SimpleCrypto.generateRandom({ length: 256 });

    var simpleCrypto = new SimpleCrypto(_secretKey);

    // add this user to the list of selectedUsers
    selectedUsers.push(user);

    const tempName = selectedUsers
      .map(u => u.firstName + ' ' + u.lastName)
      .join(', ');

    const newChannel = {
      name: tempName,
      channelType: 'dm',
      description: tempName,
    };

    try {
      // create the channel as a DM channel
      let res = await this.props.createChannel({
        variables: {
          ...newChannel,
        },
      });

      let { id } = res.data.createChannel;

      // give each user an encrypted copy of this keypair and store it in
      let promiseList = selectedUsers.map(async u => {
        const encryptedKey = await encrypt(_secretKey, u.pub);
        return this.props.createKey({
          variables: {
            key: encryptedKey,
            user: u.id,
            channel: id,
          },
        });
      });

      // add each user to this channel
      let promiseList2 = selectedUsers.map(u =>
        this.props.addUserToChannel({
          variables: {
            channel: id,
            user: u.id,
          },
        }),
      );
      // store all the keys, add all the users
      await Promise.all(promiseList);
      await Promise.all(promiseList2);

      let url =
        file === null ? null : await uploadToAWS(file, this.updateProgress);
      if (file) {
        fetch(file);
      }
      // send the first message, encrypted with the channel's SEA pair
      let newMessage = {
        text: simpleCrypto.encrypt(text.trim()),
        user: this.props.user,
        channel: id,
        file: url ? simpleCrypto.encrypt(url.url) : '',
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
      this.props.history.push(`/app/channel/${id}`);
    } catch (err) {
      console.error(new Error(err));
      swal(
        'Error',
        'We were unable to send your message, please try again later',
        'error',
      );
    }
  };
  render() {
    const { selectedUsers } = this.state;
    return (
      <div id='chat-wrapper'>
        <div id='create-dm-channel'>
          <Link to='/app'>
            <FeatherIcon icon='chevron-left' className='white db dn-l' />
          </Link>
          <DMInviteList
            shouldPlaceholder={selectedUsers.length === 0}
            updateList={this.updateList}
            selectedUsers={selectedUsers}
          />
        </div>
        <ChatWindow />
        <ChatInput
          submit={this.submit}
          text={this.state.text}
          updateText={this.updateText}
          uploadInProgress={this.state.uploadInProgress}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(CREATE_MESSAGE, { name: 'createMessage' }),
    graphql(ADD_USER_TO_CHANNEL, { name: 'addUserToChannel' }),
    graphql(CREATE_CHANNEL, { name: 'createChannel' }),
    graphql(CREATE_KEY, { name: 'createKey' }),
    graphql(GET_USER_BY_ID, {
      options: ({ user }) => ({ variables: { id: user || '' } }),
    }),
  )(withRouter(CreateDM)),
);
