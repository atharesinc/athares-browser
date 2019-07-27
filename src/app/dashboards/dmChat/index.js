import React, { Component } from "react";
import ChatWindow from "../../../components/ChatWindow";
import ChatInput from "../../../components/ChatInput";
import DMSettings from "./DMSettings";
import Loader from "../../../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import { updateChannel, removeUnreadDM } from "../../../store/state/actions";
import { connect } from "react-redux";
import { decrypt } from "src/utils/crypto";
import SimpleCrypto from "simple-crypto-js";
import { CREATE_MESSAGE } from "../../../graphql/mutations";
import {
  GET_MESSAGES_FROM_CHANNEL_ID,
  GET_USER_KEYS
} from "../../../graphql/queries";
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from "../../../graphql/subscriptions";
import { compose, graphql, Query } from "react-apollo";
import { uploadToAWS } from "src/utils/upload";
import swal from "sweetalert";
import { openDMSettings } from "../../../store/ui/actions";
const pullUI = require("../../../store/ui/reducers").pull;

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cryptoEnabled: false,
      text: "",
      uploadInProgress: false
    };
    this.simpleCrypto = new SimpleCrypto("nope");
  }
  async componentDidMount() {
    if (this.props.user === null) {
      this.props.history.push("/app");
    }

    // Make sure activeChannel is set
    if (
      this.props.activeChannel === null ||
      this.props.activeChannel !== this.props.match.params.id
    ) {
      this.props.dispatch(updateChannel(this.props.match.params.id));
    }
    if (this.props.activeChannel) {
      this.props.dispatch(removeUnreadDM(this.props.activeChannel));
    }
    if (this.props.getUserKeys.User) {
      try {
        let hashed = window.localStorage.getItem("ATHARES_HASH");
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);
        const userPriv = simpleCryptoForUserPriv.decrypt(
          this.props.getUserKeys.User.priv
        );

        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          userPriv
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
    if (
      this.props.activeChannel &&
      this.props.activeChannel !== prevProps.activeChannel
    ) {
      this.props.dispatch(removeUnreadDM(this.props.activeChannel));
    }
    if (prevProps.getUserKeys.User !== this.props.getUserKeys.User) {
      try {
        let hashed = window.localStorage.getItem("ATHARES_HASH");
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);

        let userPriv = simpleCryptoForUserPriv.decrypt(
          this.props.getUserKeys.User.priv
        );

        let decryptedChannelSecret = await decrypt(
          this.props.getUserKeys.User.keys[0].key,
          userPriv
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
  scrollToBottom = () => {
    let chatBox = document.getElementById("chat-window-scroller");
    if (chatBox) {
      /* scroll to bottom */
      chatBox = chatBox.firstElementChild;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };
  updateProgress = (prog, length) => {
    console.log(prog / length);
  };

  submit = async (text, file = null) => {
    if (text.trim() === "" && file === null) {
      return false;
    }
    if (file) {
      await this.setState({
        uploadInProgress: true
      });
    }
    let { user, activeChannel: channel } = this.props;
    try {
      let url =
        file === null ? null : await uploadToAWS(file, this.updateProgress);

      // create the message, encrypted with the channel's key
      let newMessage = {
        text: this.simpleCrypto.encrypt(text.trim()),
        user,
        channel,
        file: url ? this.simpleCrypto.encrypt(url) : "",
        fileName: file !== null ? file.name : null
      };
      this.props.createMessage({
        variables: {
          ...newMessage
        }
      });

      await this.setState({
        uploadInProgress: false
      });
      /* clear textbox */
      let chatInput = document.getElementById("chat-input");
      chatInput.value = "";
      chatInput.setAttribute("rows", 1);
      // this.scrollToBottom();
    } catch (err) {
      this.setState({
        uploadInProgress: false
      });
      console.error(new Error(err));
      swal(
        "Error",
        "We were unable to send your message, please try again later",
        "error"
      );
    }
  };
  updateChannel = () => {
    this.props.dispatch(updateChannel(null));
  };
  normalizeName = name => {
    let retval = name
      .split(", ")
      .filter(
        n =>
          n !==
          this.props.getUserKeys.User.firstName +
            " " +
            this.props.getUserKeys.User.lastName
      );
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
  _subToMore = subscribeToMore => {
    subscribeToMore({
      document: SUB_TO_MESSAGES_BY_CHANNEL_ID,
      variables: { id: this.props.activeChannel || "" },
      updateQuery: (prev, { subscriptionData }) => {
        // this.props.getChannelMessages.refetch({
        //   id: activeChannel
        // });
        let newMsg = subscriptionData.data.Message.node;
        if (!prev.Channel.messages.find(m => m.id === newMsg.id)) {
          // merge new messages into prev.messages
          prev.Channel.messages = [...prev.Channel.messages, newMsg];
        }

        return prev;
      }
    });
  };
  showDMSettings = () => {
    this.props.dispatch(openDMSettings());
  };
  render() {
    let { getUserKeys } = this.props;
    let channel = null,
      messages = [],
      user = null;
    return (
      <Query
        query={GET_MESSAGES_FROM_CHANNEL_ID}
        variables={{ id: this.props.activeChannel || "" }}
        onCompleted={this.scrollToBottom}
      >
        {({ data, subscribeToMore }) => {
          if (data.Channel) {
            this._subToMore(subscribeToMore);
            channel = data.Channel;
            messages = data.Channel.messages;
          }
          if (getUserKeys.User) {
            user = getUserKeys.User;
          }

          if (channel && messages && user && this.state.cryptoEnabled) {
            messages = messages.map(m => ({
              ...m,
              text: this.simpleCrypto.decrypt(m.text),
              file: m.file ? this.simpleCrypto.decrypt(m.file) : null
            }));
            return (
              <div id="chat-wrapper">
                <div id="current-dm-channel">
                  <Link to="/app">
                    <FeatherIcon
                      icon="chevron-left"
                      className="white db dn-ns"
                    />
                  </Link>
                  <div>{this.normalizeName(channel.name)}</div>
                  <FeatherIcon
                    icon="more-vertical"
                    className="white db pointer"
                    onClick={this.showDMSettings}
                  />
                </div>
                {messages.length !== 0 ? (
                  <ChatWindow messages={messages} user={user} />
                ) : (
                  <Loader />
                )}
                <ChatInput
                  submit={this.submit}
                  uploadInProgress={this.state.uploadInProgress}
                />
                {this.props.dmSettings && <DMSettings />}
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
    activeChannel: pull(state, "activeChannel"),
    dmSettings: pullUI(state, "dmSettings")
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
