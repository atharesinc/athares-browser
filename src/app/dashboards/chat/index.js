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
import moment from "moment";

class Chat extends Component {
  state = {
    messages: [],
    channel: "",
    user: null
  };
  componentDidMount() {
    this.getUser();
    this.getChannel();
  }
  componentDidUpdate = prevProps => {
    if (prevProps.activeChannel !== this.props.activeChannel || prevProps.activeCircle !== this.props.activeCircle) {
      this.getChannel();
      this.getMessages();
    }
  };
  getMessages = () => {
    let channelID = this.props.activeChannel ? this.props.activeChannel : this.props.match.params.id;
    let channelRef = this.props.gun.get("channels").get(channelID);
    let messagesRef = this.props.gun.get("messages");
    // get a reference to see other users readonly data
    let privUserRef = this.props.gun.user;
    let pubUserRef = this.props.gun.get("users");

    channelRef.get("messages").on(msg => {
      // get each message
      messagesRef.get(msg).once(message => {
        console.log(message);
        pubUserRef.get(message.user).once(pub => {
          console.log(pub);
          let thisUser = this.props.gun.user(pub);
          thisUser.get("profile").once(userInfo => {
            message.user = userInfo;
            this.setState({
              messages: [...this.state.messages, message]
            });
          });
        });
      });
    });
  };
  getUser = async () => {
    let user = null;
    // if the user is logged in, get their user profile
    let userRef = this.props.gun.user();

    if (this.props.user) {
      userRef.get("profile").once(userInfo => {
        user = userInfo;
      });
    }
    this.setState({ user });
  };
  getMessagesFromListener = async () => {
    // reset state
    await this.setState({
      messages: []
    });

    let channelID = this.props.activeChannel ? this.props.activeChannel : this.props.match.params.id;
    let channelRef = this.props.gun.get("channels").get(channelID);
    let messagesRef = this.props.gun.get("messages");

    // get a reference to see other users readonly data
    let privUserRef = this.props.gun.user;
    let pubUserRef = this.props.gun.get("users");
    let channel = null,
      messages = [];

    // get the channel's info
    channelRef.once(channelInfo => {
      // get the message references from this channel
      channelRef.get("messages").map(msg => {
        // get each message
        messagesRef.get(msg).once(message => {
          console.log(message);
          pubUserRef.get(message.user).once(pub => {
            console.log(pub);
            let thisUser = this.props.gun.user(pub);
            thisUser.get("profile").once(userInfo => {
              message.user = userInfo;
              this.setState({
                messages: [...this.state.messages, message]
              });
            });
          });
        });
      });
    });
  };
  getChannel = () => {
    let channelID = this.props.activeChannel ? this.props.activeChannel : this.props.match.params.id;
    let channelRef = this.props.gun.get("channels").get(channelID);

    channelRef.once(channelInfo => {
      this.setState({
        channel: channelInfo
      });
    });
  };
  submit = async text => {
    let chatInput = document.getElementById("chat-input");

    let message = {
      id: Gun.text.random(),
      text: text.trim(),
      user: this.props.user,
      channel: this.props.activeChannel,
      circle: this.props.activeCircle,
      createdAt: moment().format(),
      updatedAt: moment().format()
    };

    // set the message
    this.props.gun
      .get("messages")
      .get(message.id)
      .put(message);

    // set the message reference in the channel
    this.props.gun
      .get("channels")
      .get(this.props.activeChannel)
      .get("messages")
      .set(message.id);

    // and the reference in this user
    let user = this.props.gun.user();
    user.get("messages").set(message.id);

    /* clear textbox */
    chatInput.value = "";
    chatInput.setAttribute("rows", 1);

    // /* scroll to bottom */
    // let chatBox = document.getElementById("chat-window-inner");
    // chatBox.scrollTop = chatBox.scrollHeight;
  };
  render() {
    let { user, channel, messages } = this.state;
    messages = messages.sort((a, b) => a.createdAt > b.createdAt);
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
        <div id="chat-wrapper" style={{ justifyContent: "center" }}>
          <Loader />
          <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Getting Messages</h1>
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
