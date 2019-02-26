import React, { Component, Fragment } from "react";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { toggleAddUsers } from "../../../store/ui/actions";
import FeatherIcon from "feather-icons-react";
import AddMoreUsers from "./AddMoreUsers";
import {
  GET_USERS_BY_CHANNEL_ID,
  GET_USER_KEYS
} from "../../../graphql/queries";
import {
  ADD_USER_TO_CHANNEL,
  CREATE_KEY,
  UPDATE_CHANNEL_NAME
} from "../../../graphql/mutations";
import SimpleCrypto from "simple-crypto-js";
import { decrypt, encrypt } from "simple-asym-crypto";
import swal from "sweetalert";

const pullUI = require("../../../store/ui/reducers").pull;

class AddUserToDM extends Component {
  constructor() {
    super();

    this.state = {
      selectedUsers: []
    };
  }

  updateList = selectedUsers => {
    this.setState({
      selectedUsers
    });
  };
  submit = async () => {
    // hoo boy theres a lot to do here
    let { selectedUsers } = this.state;
    let { activeChannel, updateChannelName } = this.props;
    let { User: user } = this.props.getUserKeys;
    // get the users encrypted priv key
    let userChannelKey = user.keys[0].key;
    let myToken = window.localStorage.getItem("ATHARES_TOKEN");

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
        return this.props.createKey({
          variables: {
            key: encryptedKey,
            user: u.id,
            channel: activeChannel
          }
        });
      });

      // add each user to this channel
      let promiseList2 = selectedUsers.map(u =>
        this.props.addUserToChannel({
          variables: {
            channel: activeChannel,
            user: u.id
          }
        })
      );
      const { users: existingUsers } = this.props.getUsers.Channel;
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
      this.props.dispatch(toggleAddUsers());
      this.setState({
        selectedUsers: []
      });
      this.props.getUsers.refetch();
      swal("Users Added", "Successfully added users", "success");
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "There was an error adding users at this time", "error");
    }
  };
  toggleUserInput = () => {
    this.props.dispatch(toggleAddUsers());
  };
  render() {
    let users = [];
    if (this.props.getUsers.Channel) {
      users = this.props.getUsers.Channel.users;
    }
    return (
      <Fragment>
        <div
          className="flex items-center lh-copy ph0 h3 bb b--white-10 dim pointer"
          onClick={this.toggleUserInput}
        >
          <div className="pl3 flex-auto" to="about">
            <span className="f5 db white">Add Users</span>
            {users.length >= 6 && (
              <span className="f6 white-50">You can't add any more users</span>
            )}
          </div>
          <FeatherIcon
            className="w2 h2 w3-ns h3-ns pa3-ns pa0"
            icon="user-plus"
          />
        </div>
        {this.props.showAddMoreUsers && (
          <div className="flex flex-row justify-between items-start">
            <AddMoreUsers
              selectedUsers={this.state.selectedUsers || []}
              existingUsers={users || []}
              updateList={this.updateList}
            />
            <FeatherIcon
              icon="plus"
              className="white w2 h-100 bg-theme-blue ph1 ph2 pointer"
              onClick={this.submit}
            />
          </div>
        )}
      </Fragment>
    );
  }
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
