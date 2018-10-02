import React, { Component } from "react";
import ChatWindow from "../chat/ChatWindow";
import ChatInput from "./ChatInput";
import DMInviteList from "./DMInviteList";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import * as stateSelectors from "../../../store/state/reducers";
import { connect } from "react-redux";
import { withGun } from "react-gun";

class CreateDM extends Component {
  state = {
    users: []
  };
  updateList = items => {
    this.setState({
      users: items
    });
  };
  isSubmit = async text => {
    if (this.state.users.length === 0) {
      console.log("no users!");
      return false;
    }

    // get user's id, add it to array
    // const user = getUserSomehow()
    // const users = [].concat(this.state.users, user);
    // const channelName = users.map(u => u.id).sort().join("-")
    // see if a channel exists by this name

    // const res = await this.props.checkChannelExists({variables: {name: "channelName"}})
    // if it exists, send message, and redirect to relevant chat
    //otherwise create the chat channel, send the message and redirect
    let chatInput = document.getElementById("chat-input");

    try {
      // 	/* create message and send to API */
      // 	await this.props.createMessageMutation({
      // 		variables: {
      // 			text: text.trim(),
      // 			user_id: this.props.user._id,
      // 			circle_id: this.props.activeCircle._id,
      // 			channel_id: this.props.channel._id,
      // 		}
      // 	});

      // 	/* refetch messages */
      // 	this.props.getMessagesQuery.refetch();
      /* clear textbox */
      chatInput.value = "";
      chatInput.setAttribute("rows", 1);
      /* scroll to bottom */
      let chatBox = document.getElementById("chat-window-inner");
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      throw new Error(err);
      // swal("Oops", "There was an error connecting to the server", "error");
    }
  };
  componentDidMount() {
    if (!this.props.user) {
      this.props.history.push("/app");
    }
    document.getElementById("no-messages").innerText =
      "Enter a user's name to start a conversation";
  }
  render() {
    return (
      <div id="chat-wrapper">
        <div id="current-channel">
          <Link to="/app">
            <FeatherIcon icon="chevron-left" className="white db dn-ns" />
          </Link>
          <DMInviteList
            shouldPlaceholder={this.state.users.length === 0}
            updateList={this.updateList}
          />
          <FeatherIcon icon="more-vertical" className="white db dn-ns" />
        </div>
        <ChatWindow />
        <ChatInput isSubmit={this.isSubmit} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user")
  };
}

export default withGun(connect(mapStateToProps)(CreateDM));
