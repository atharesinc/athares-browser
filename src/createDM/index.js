import React, { useState, useEffect, useGlobal, withGlobal } from 'reactn';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import DMInviteList from './DMInviteList';
import { Link, withRouter } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';

import { encrypt } from '../utils/crypto';
import SimpleCrypto from 'simple-crypto-js';
import { GET_USER_BY_ID_WITH_PRIV } from '../graphql/queries';
import {
  CREATE_DM_CHANNEL,
  CREATE_KEY,
  CREATE_MESSAGE,
  ADD_USER_TO_CHANNEL,
} from '../graphql/mutations';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { uploadToAWS } from 'utils/upload';
import swal from 'sweetalert';
import CreatePINModal from '../components/CreatePINModal';
import GetPINModal from '../components/GetPINModal';

function CreateDM(props) {
  const [text, setText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [, setActiveChannel] = useGlobal('activeChannel');
  const [showCreatePin, setShowCreatePin] = useState(false);
  const [showGetPin, setShowGetPin] = useState(false);

  useEffect(() => {
    function componentMount() {
      if (!props.user) {
        props.history.push('/app');
      }
      document.getElementById('no-messages').innerText =
        "Enter a user's name to start a conversation";
      setActiveChannel(null);
    }
    componentMount();
  }, [props.user, props.history, setActiveChannel]);

  const submit = async (text = '', file = null) => {
    let { data } = props;
    if (!data.user) {
      return false;
    }

    // We're going to allow users to have no recipients because they always get added to a channel on creation
    // This defaults to a "just you" channel but they can later add users if they like
    // if (selectedUsers.length === 0) {
    //   return false;
    // }
    // if the user addresses themselves, remove them because they'll get added anyway
    let userIndex = selectedUsers.findIndex(u => u.id === props.user);
    if (userIndex !== -1) {
      selectedUsers.splice(userIndex, 1);
    }
    if (text.trim().length === 0 && file === null) {
      return false;
    }

    setUploadInProgress(true);

    let { user } = props.data;

    // create a symmetric key for the new channel
    var _secretKey = SimpleCrypto.generateRandom({ length: 256 });

    var simpleCrypto = new SimpleCrypto(_secretKey);

    // add this user to the list of selectedUsers
    selectedUsers.push(user);

    const tempName = selectedUsers
      .map(u => {
        if (u.firstName && u.lastName) {
          return u.firstName + ' ' + u.lastName;
        } else {
          return 'Anonymous';
        }
      })
      .join(', ');

    const newChannel = {
      name: tempName,
      channelType: 'dm',
      description: tempName,
    };

    try {
      // create the channel as a DM channel
      let res = await props.createChannel({
        variables: {
          ...newChannel,
          id: user.id,
        },
      });

      let { id } = res.data.channelCreate;

      // give each user an encrypted copy of this keypair and store it in
      let promiseList = selectedUsers.map(async u => {
        const encryptedKey = await encrypt(_secretKey, u.pub);
        return props.createKey({
          variables: {
            key: encryptedKey,
            user: u.id,
            channel: id,
          },
        });
      });

      // add each user to this channel
      let promiseList2 = selectedUsers.map(u =>
        props.addUserToChannel({
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
        file === null ? null : await uploadToAWS(file, setUploadInProgress);
      if (file) {
        fetch(file);
      }

      // send the first message, encrypted with the channel's key pair
      let newMessage = {
        text: simpleCrypto.encrypt(text.trim()),
        user: user.id,
        channel: id,
        file: url ? simpleCrypto.encrypt(url.url) : '',
        fileName: file !== null ? file.name : null,
      };

      await props.createMessage({
        variables: {
          ...newMessage,
        },
      });

      setActiveChannel(id);
      props.history.push(`/app/channel/${id}`);
    } catch (err) {
      console.error(new Error(err));
      swal(
        'Error',
        'We were unable to send your message, please try again later',
        'error',
      );
    }
    setUploadInProgress(false);
  };

  // if the user has no public key, prompt to create one
  if (props.data.user && !props.data.user.pub) {
    if (showCreatePin === false) {
      setShowCreatePin(true);
    }
  }

  // if the user has a public key, but has not decrypted their private key
  if (
    props.data.user &&
    props.data.user.pub &&
    !window.localStorage.getItem('ATHARES_HASH')
  ) {
    if (showGetPin === false) {
      setShowGetPin(true);
    }
  }

  return (
    <div id='chat-wrapper'>
      {showCreatePin && (
        <CreatePINModal id={props.user} hide={setShowCreatePin} />
      )}
      {showGetPin && (
        <GetPINModal priv={props.data.user.priv} show={setShowGetPin} />
      )}

      <div id='create-dm-channel'>
        <Link to='/app'>
          <ChevronLeft className='white db dn-l' />
        </Link>
        <DMInviteList
          shouldPlaceholder={selectedUsers.length === 0}
          updateList={setSelectedUsers}
          selectedUsers={selectedUsers}
        />
      </div>
      <ChatWindow />
      <ChatInput
        submit={submit}
        text={text}
        updateText={setText}
        uploadInProgress={uploadInProgress}
      />
    </div>
  );
}

export default withGlobal(({ user }) => ({ user }))(
  compose(
    graphql(CREATE_MESSAGE, { name: 'createMessage' }),
    graphql(ADD_USER_TO_CHANNEL, { name: 'addUserToChannel' }),
    graphql(CREATE_DM_CHANNEL, { name: 'createChannel' }),
    graphql(CREATE_KEY, { name: 'createKey' }),
    graphql(GET_USER_BY_ID_WITH_PRIV, {
      options: ({ user }) => ({ variables: { id: user || '' } }),
    }),
  )(withRouter(CreateDM)),
);
