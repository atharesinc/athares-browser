import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import * as stateSelectors from "../../../store/state/reducers";
import { connect } from "react-redux";
import { withGun } from "../../../utils/react-gun";
import Gun from "gun/gun";

class Chat extends Component {
  state = {
    messages: [],
    channel: "",
    user: ""
  };
  submit = async text => {
    let chatInput = document.getElementById("chat-input");

    let message = {
      id: Gun.text.random(),
      text: text.trim(),
      userId: this.props.user,
      channelId: this.props.activeChannel,
      circleId: this.props.activeCircle
    };

    // this.channel
    //   .get("messages")
    //   .get(Gun.text.random())
    //   .put(message);

    /* clear textbox */
    chatInput.value = "";
    chatInput.setAttribute("rows", 1);

    /* scroll to bottom */
    let chatBox = document.getElementById("chat-window-inner");
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  componentDidMount() {
    // get user from gun by user id
    // get channel details by activeChannel
    // this.messages = this.gun.get("channels").get(this.props.activeChannel).get("messages");
    // this.messages.map().on(() => {
    //     let messages = [];
    //     this.messages.map().once(message => {
    //         this.users.get(message.user).once(user => {
    //             messages.push({...message, user});
    //         });
    //     });
    //     this.setState({
    //         messages,
    //         user,
    //         channel
    //     });
    // });
  }
  render() {
    const { user, channel, messages } = this.state;

    if (channel) {
      return (
        <div id="chat-wrapper">
          <div id="current-channel">
            <Link to="/app">
              <FeatherIcon icon="chevron-left" className="white db dn-ns" />
            </Link>
            <div>{channel.name}</div>
            <FeatherIcon icon="more-vertical" className="white db dn-ns" />
          </div>
          <ChatWindow messages={messages} user={user} />
          {user && <ChatInput submit={this.submit} />}
        </div>
      );
    } else {
      return (
        <div id="chat-wrapper">
          <Loader />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    activeChannel: stateSelectors.pull(state, "activeChannel"),
    activeCircle: stateSelectors.pull(state, "activeCircle")
  };
}

export default withGun(connect(mapStateToProps)(Chat));
