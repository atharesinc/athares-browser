import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import { updateChannel } from "../../../store/state/actions";
import { connect } from "react-redux";
import moment from "moment";
import { decrypt } from "simple-asym-crypto";
import SimpleCrypto from "simple-crypto-js";
import { CREATE_MESSAGE } from "../../../graphql/mutations";
import {
  GET_MESSAGES_FROM_CHANNEL_ID,
  GET_USER_KEYS
} from "../../../graphql/queries";
import { compose, graphql, Query } from "react-apollo";

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptoEnabled: false,
      text: ""
    };
    this.simpleCrypto = new SimpleCrypto("nope");
  }
  async componentDidMount() {
    if (this.props.user === null) {
      this.props.history.push("/app");
    }
    // this._isMounted && (await this.getUser());

    // Make sure activeChannel is set
    if (
      this.props.activeChannel === null ||
      this.props.activeChannel !== this.props.match.params.id
    ) {
      this.props.dispatch(updateChannel(this.props.match.params.id));
    } else {
      //   this._isMounted && (await this.decryptMessages());
      this.scrollToBottom();
    }
    if (this.props.getUserKeys.User) {
      try {
        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          this.props.getUserKeys.User.priv
        );

        this.simpleCrypto.setSecret(decryptedChannelSecret);
        this.setState({
          cryptoEnabled: true
        });
      } catch (err) {
        console.error(new Error(err));
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.getUserKeys.User !== this.props.getUserKeys.User) {
      try {
        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          this.props.getUserKeys.User.priv
        );

        this.simpleCrypto.setSecret(decryptedChannelSecret);
        this.setState({
          cryptoEnabled: true
        });
      } catch (err) {
        console.error(new Error(err));
      }
    }
    this.scrollToBottom();
  }
  scrollToBottom = () => {
    let chatBox = document.getElementById("chat-window");
    if (chatBox) {
      /* scroll to bottom */
      chatBox = chatBox.firstElementChild.firstElementChild;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  submit = async text => {
    let chatInput = document.getElementById("chat-input");
    let { user, activeChannel: channel } = this.props;
    // create the message, encrypted with the channel's key
    let newMessage = {
      text: this.simpleCrypto.encrypt(text.trim()),
      user,
      channel
    };
    this.props.createMessage({
      variables: {
        ...newMessage
      }
    });

    /* clear textbox */
    chatInput.value = "";
    chatInput.setAttribute("rows", 1);

    /* scroll to bottom */
    let chatBox = document.getElementById("chat-window").firstElementChild
      .firstElementChild;
    chatBox.scrollTop = chatBox.scrollHeight;
  };
  updateChannel = () => {
    this.props.dispatch(updateChannel(null));
  };
  normalizeName = name => {
    let retval = name
      .split(", ")
      .filter(n => n !== this.props.getUserKeys.User.firstName);
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
    let { activeChannel, getUserKeys } = this.props;
    let channel = null,
      messages = [],
      user = null;
    return (
      <Query
        query={GET_MESSAGES_FROM_CHANNEL_ID}
        variables={{ id: this.props.activeChannel || "" }}
        pollInterval={1500}
      >
        {({ loading, err, data }) => {
          if (data.Channel) {
            channel = data.Channel;
            messages = data.Channel.messages;
          }
          if (getUserKeys.User) {
            user = getUserKeys.User;
          }

          if (channel && messages && user && this.state.cryptoEnabled) {
            messages = messages.map(m => ({
              ...m,
              text: this.simpleCrypto.decrypt(m.text)
            }));
            return (
              <div id="chat-wrapper">
                <div id="current-channel">
                  <Link to="/app">
                    <FeatherIcon
                      icon="chevron-left"
                      className="white db dn-ns"
                    />
                  </Link>
                  <div>{this.normalizeName(channel.name)}</div>
                  <FeatherIcon
                    icon="more-vertical"
                    className="white db dn-ns"
                  />
                </div>
                {messages.length !== 0 ? (
                  <ChatWindow messages={messages} user={user} />
                ) : (
                  <Loader />
                )}
                <ChatInput submit={this.submit} />
              </div>
            );
          } else {
            return (
              <div id="chat-wrapper" style={{ justifyContent: "center" }}>
                <Loader />
              </div>
            );
          }
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel")
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(CREATE_MESSAGE, { name: "createMessage" }),
    graphql(GET_USER_KEYS, {
      name: "getUserKeys",
      options: ({ user, activeChannel }) => ({
        variables: { user: user, channel: activeChannel }
      })
    })
  )(DMChat)
);
