import React, { Component } from "react";
import ChatWindow from "../chat/ChatWindow";
import ChatInput from "./ChatInput";
import DMInviteList from "./DMInviteList";
import { Link, withRouter } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import * as stateSelectors from "../../../store/state/reducers";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import { encrypt } from "simple-asym-crypto";
import Gun from "gun/gun";
import moment from "moment";

class CreateDM extends Component {
  constructor(props){
super(props);
    this.state = {
      text: "",
      selectedUsers: [],
      suggestions: []
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    if (!this.props.user) {
      this.props.history.push("/app");
    }
    document.getElementById("no-messages").innerText =
      "Enter a user's name to start a conversation";

    this._isMounted && this.getUsers();
  }
  getUsers = () => {
    let gunRef = this.props.gun;
    gunRef.get("users").listonce(obj => {
      let users = [];

      // painstakingly get all the users
      // maybe a task for a webworker?
      obj.list.forEach(pub => {
        let thisUser = gunRef.user(pub);
        thisUser.get("profile").once(user => {
          users.push({ ...user, name: user.firstName + " " + user.lastName });
        });
      });

      this._isMounted && this.setState({
        suggestions: users
      });
    });
  }
  componentWillUnmount(){
    this._isMounted = false;
  }
  updateList = items => {
    this.setState({
      selectedUsers: items
    });
  };
  updateText = text => {
    this.setState({
      text
    });
  };
  submit = async () => {
    let { selectedUsers, text } = this.state;
    if (selectedUsers.length === 0) {
      console.log("no users!");
      return false;
    }
    if (text.trim().length === 0) {
      console.log("no text!");
      return false;
    }
    // create a pub/priv key pair for the new channel
    let pair = await this.props.SEA.pair();
    let gunRef = this.props.gun;
    // add this user to the list of selectedUsers
    let user = gunRef.user();
    user.get("profile").once(async profile => {
      selectedUsers.push(profile);

      const newChannel = {
        name: selectedUsers.map(u => u.firstName + " " + u.lastName).join(", "),
        channelType: "dm",
        id: "DM" + Gun.text.random(),
         createdAt: moment().format(),
        updatedAt: moment().format()
      };
      // give each user an encrypted copy of this keypair
      selectedUsers.forEach(async user => {
        // this is the symmetric shared key all users will need to encrypt and decrypt messages in this channel
        // we encrypt the symmetric key with
        const encryptedPair = await encrypt(pair, user.apub);
        let keychain = gunRef.get(user.keychain);
        console.log(keychain);
        keychain.set({ ...newChannel, key: encryptedPair });
      });
      // create channel node
      let channel = gunRef.get(newChannel.id);
      channel.put(newChannel);

      // set this node as a channel
      gunRef.get("channels").set(channel);

      // send the first message, encrypted with the channel's SEA pair
      let newMessage = {
        id: "MS" + Gun.text.random(),
        text: await this.props.SEA.encrypt(this.state.text.trim(), pair),
        user: profile,
        channel: newChannel.id,
        createdAt: moment().format(),
        updatedAt: moment().format()
      };

      let message = gunRef.get(newMessage.id);
      message.put(newMessage);

      gunRef.get("messages").set(message);
      channel.get("messages").set(message, ()=>{
              this.props.history.push(`/app/channel/${newChannel.id}`);
      });

    });
  };
  render() {
    const { suggestions, selectedUsers } = this.state;
    console.log(suggestions, selectedUsers);
    return (
      <div id="chat-wrapper">
        <div id="current-channel">
          <Link to="/app">
            <FeatherIcon icon="chevron-left" className="white db dn-ns" />
          </Link>
          <DMInviteList
            shouldPlaceholder={this.state.selectedUsers.length === 0}
            updateList={this.updateList}
            suggestions={suggestions}
            selectedUsers={selectedUsers}
          />
          <FeatherIcon icon="more-vertical" className="white db dn-ns" />
        </div>
        <ChatWindow />
        <ChatInput
          submit={this.submit}
          text={this.state.text}
          updateText={this.updateText}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user")
  };
}

export default withRouter(withGun(connect(mapStateToProps)(CreateDM)));