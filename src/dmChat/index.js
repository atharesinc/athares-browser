import React, { useState } from "reactn";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import DMSettings from "./DMSettings";
import Loader from "../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../store/state/reducers";
import { updateChannel, removeUnreadDM } from "../store/state/actions";

import { decrypt } from "utils/crypto";
import SimpleCrypto from "simple-crypto-js";
import { CREATE_MESSAGE } from "../graphql/mutations";
import {
  GET_MESSAGES_FROM_CHANNEL_ID,
  GET_USER_KEYS
} from "../graphql/queries";
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from "../graphql/subscriptions";
import { graphql, Query } from "react-apollo";
import compose from "lodash.flowright";
import { uploadToAWS } from "utils/upload";
import swal from "sweetalert";
import { openDMSettings } from "../store/ui/actions";
const pullUI = require("../store/ui/reducers").pull;

function DMChat (){
  

    this.state = {
      cryptoEnabled: false,
      text: "",
      uploadInProgress: false
    };
    this.simpleCrypto = new SimpleCrypto("nope");
  
useEffect(()=>{
 componentMount();
}, [])

const componentMount =   async  => {
    if (props.user === null) {
      props.history.push("/app");
    }

    // Make sure activeChannel is set
    if (
      props.activeChannel === null ||
      props.activeChannel !== props.match.params.id
    ) {
      props.dispatch(updateChannel(props.match.params.id));
    }
    if (props.activeChannel) {
      props.dispatch(removeUnreadDM(props.activeChannel));
    }
    if (props.getUserKeys.User) {
      try {
        let hashed = window.localStorage.getItem("ATHARES_HASH");
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);
        const userPriv = simpleCryptoForUserPriv.decrypt(
          props.getUserKeys.User.priv
        );

        let decryptedChannelSecret = await decrypt(
          props.getUserKeys.User.keys[0].key,
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
      props.activeChannel &&
      props.activeChannel !== prevProps.activeChannel
    ) {
      props.dispatch(removeUnreadDM(props.activeChannel));
    }
    if (prevProps.getUserKeys.User !== props.getUserKeys.User) {
      try {
        let hashed = window.localStorage.getItem("ATHARES_HASH");
        let simpleCryptoForUserPriv = new SimpleCrypto(hashed);

        let userPriv = simpleCryptoForUserPriv.decrypt(
          props.getUserKeys.User.priv
        );

        let decryptedChannelSecret = await decrypt(
          props.getUserKeys.User.keys[0].key,
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
  const scrollToBottom = () => {
    let chatBox = document.getElementById("chat-window-scroller");
    if (chatBox) {
      /* scroll to bottom */
      chatBox = chatBox.firstElementChild;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  const submit = async (text, file = null) => {
    if (text.trim() === "" && file === null) {
      return false;
    }
    if (file) {
      await this.setState({
        uploadInProgress: true
      });
    }
    let { user, activeChannel: channel } = props;
    try {
      let url = file === null ? null : await uploadToAWS(file);

      // create the message, encrypted with the channel's key
      let newMessage = {
        text: this.simpleCrypto.encrypt(text.trim()),
        user,
        channel,
        file: url ? this.simpleCrypto.encrypt(url.url) : "",
        fileName: file !== null ? file.name : null
      };
      props.createMessage({
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
  const updateChannel = () => {
    props.dispatch(updateChannel(null));
  };
  const normalizeName = name => {
    let retval = name
      .split(", ")
      .filter(
        n =>
          n !==
          props.getUserKeys.User.firstName +
            " " +
            props.getUserKeys.User.lastName
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
      variables: { id: props.activeChannel || "" },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        let newMsg = subscriptionData.data.Message.node;
        if (!prev.Channel.messages.find(m => m.id === newMsg.id)) {
          return {
            Channel: {
              ...prev.Channel,
              messages: [...prev.Channel.messages, newMsg]
            }
          };
        } else {
          return prev;
        }
      }
    });
  };
  const showDMSettings = () => {
    props.dispatch(openDMSettings());
  };
  
    let { getUserKeys } = props;
    let channel = null,
      messages = [],
      user = null;
    return (
      <Query
        query={GET_MESSAGES_FROM_CHANNEL_ID}
        variables={{ id: props.activeChannel || "" }}
        onCompleted={this.scrollToBottom}
      >
        {({ data = {}, subscribeToMore }) => {
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
                {props.dmSettings && <DMSettings />}
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
