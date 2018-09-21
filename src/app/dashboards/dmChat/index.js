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

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      channel: null,
      user: null
    };

    this.channel = this.props.gun.get("channels").get(this.props.activeChannel);
  }
  submit = async text => {
    let chatInput = document.getElementById("chat-input");

    let message = {
      id: Gun.text.random(),
      text: text.trim(),
      userId: this.props.user,
      channelId: this.props.activeChannel
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
  normalizeName = name => {
    let retval = name.split("-").filter(n => n !== this.state.user.firstName);
    if (retval.length === 0) {
      return name;
    }
    if (retval.length < 3) {
      return retval.join(" & ");
    }
    if (retval.length < 6) {
      retval = [
        ...retval.splice(0, retval.length - 1),
        ["and", retval[retval.length - 1]].join(" ")
      ];
      retval = retval.join(", ");
      return retval;
    }
    retval = [...retval.splice(0, 4), "...and " + retval.length + " more"];
    retval = retval.join(", ");
    return retval;
  };

  render() {
    const { user, channel, messages } = this.state;
    if (channel) {
      return (
        <div id="chat-wrapper">
          <div id="current-channel">
            <Link to="/app">
              <FeatherIcon icon="chevron-left" className="white db dn-ns" />
            </Link>
            <div>{this.normalizeName(channel.name)}</div>
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
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    activeChannel: stateSelectors.pull(state, "activeChannel")
  };
}

export default withGun(connect(mapStateToProps)(DMChat));
