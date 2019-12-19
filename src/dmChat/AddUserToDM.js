import React, { Component, Fragment } from "reactn";
import { graphql } from "react-apollo";
import compose from 'lodash.flowright'

import { pull } from "../store/state/reducers";
import { toggleAddUsers } from "../store/ui/actions";
import FeatherIcon from "feather-icons-react";
import AddMoreUsers from "./AddMoreUsers";
import {
  GET_USERS_BY_CHANNEL_ID,
  GET_USER_KEYS
} from "../graphql/queries";
import {
  ADD_USER_TO_CHANNEL,
  CREATE_KEY,
  UPDATE_CHANNEL_NAME
} from "../graphql/mutations";
import SimpleCrypto from "simple-crypto-js";
import { decrypt, encrypt } from "utils/crypto";
import swal from "sweetalert";

const pullUI = require("../store/ui/reducers").pull;

function AddUserToDM (){
  

    state = {
      selectedUsers: []
    };
  

  const updateList = selectedUsers => {
    setState({
      selectedUsers
    });
  };
  const submit = async () => {
    // hoo boy theres a lot to do here
    let { selectedUsers } = state;
    let { activeChannel, updateChannelName } = props;
    let { User: user } = props.getUserKeys;
    // get the users encrypted priv key
    let userChannelKey = user.keys[0].key;
    let myToken = window.localStorage.getItem("ATHARES_HASH");

    // decrypt user's priv with stored token
    let simpleCrypto = new SimpleCrypto(myToken);

    let userPriv = simpleCrypto.decrypt(user.priv);

    try {
      // decrypt this user's channel key
      let decryptedChannelSecret = await decrypt(userChannelKey, userPriv);

      // for each new user, encrypt the sym key
      // add connection from new user to channel
      // add each users key
      // give each user an encrypted copy of this keypair and store it in
      let promiseList = selectedUsers.map(async u => {
        const encryptedKey = await encrypt(decryptedChannelSecret, u.pub);
        return props.createKey({
          variables: {
            key: encryptedKey,
            user: u.id,
            channel: activeChannel
          }
        });
      });

      // add each user to this channel
      let promiseList2 = selectedUsers.map(u =>
        props.addUserToChannel({
          variables: {
            channel: activeChannel,
            user: u.id
          }
        })
      );
      const { users: existingUsers } = props.getUsers.Channel;
      const allUsers = [...selectedUsers, ...existingUsers];

      const channelName = allUsers
        .map(u => u.firstName + " " + u.lastName)
        .join(", ");

      // store all the keys, add all the users, and update the channel name
      await Promise.all(promiseList);
      await Promise.all(promiseList2);
      updateChannelName({
        variables: {
          id: activeChannel,
          name: channelName
        }
      });
      props.dispatch(toggleAddUsers());
      setState({
        selectedUsers: []
      });
      props.getUsers.refetch();
      swal("Users Added", "Successfully added users", "success");
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "There was an error adding users at this time", "error");
    }
  };
  const toggleUserInput = () => {
    props.dispatch(toggleAddUsers());
  };
  
    let users = [];
    if (props.getUsers.Channel) {
      users = props.getUsers.Channel.users;
    }
    return (
      <Fragment>
        <div
          className="flex items-center lh-copy h3 bb b--white-10 dim pointer ph3"
          onClick={toggleUserInput}
        >
          <div className="flex-auto">
            <span className="f5 db white">Add Users</span>
            {users.length >= 6 && (
              <span className="f6 white-50">You can't add any more users</span>
            )}
          </div>
          <FeatherIcon className="w2 h2 h3-ns" icon="user-plus" />
        </div>
        {props.showAddMoreUsers && (
          <div className="flex flex-row justify-between items-center">
            <AddMoreUsers
              selectedUsers={selectedUsers || []}
              existingUsers={users || []}
              updateList={updateList}
            />
            <FeatherIcon
              icon="plus"
              className="white w3 h-100 bg-theme-blue pv1 ph2 pointer"
              onClick={submit}
            />
          </div>
        )}
      </Fragment>
    );
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel"),
    showAddMoreUsers: pullUI(state, "showAddMoreUsers")
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(ADD_USER_TO_CHANNEL, { name: "addUserToChannel" }),
    graphql(UPDATE_CHANNEL_NAME, { name: "updateChannelName" }),
    graphql(CREATE_KEY, { name: "createKey" }),
    graphql(GET_USER_KEYS, {
      name: "getUserKeys",
      options: ({ activeChannel, user }) => ({
        variables: { channel: activeChannel || "", user: user || "" }
      })
    }),
    graphql(GET_USERS_BY_CHANNEL_ID, {
      name: "getUsers",
      options: ({ activeChannel }) => ({
        variables: { id: activeChannel || "" }
      })
    })
  )(AddUserToDM)
);
