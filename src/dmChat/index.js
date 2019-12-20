import React, { useState, useGlobal, useEffect, withGlobal } from "reactn";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import DMSettings from "./DMSettings";
import Loader from "../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

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

function DMChat(props) {
  const [cryptoEnabled, setCryptoEnabled] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const [simpleCrypto, setSimpleCrypto] = useState(new SimpleCrypto("nope"));
  const [dmSettings, setDmSettings] = useGlobal("dmSettings");
  const [unreadDMs, setUnreadDMs] = useGlobal("unreadDMs");
  const [, setActiveChannel] = useGlobal("activeChannel");
  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = async () => {
    if (props.user === null) {
      props.history.push("/app");
    }

    // Make sure activeChannel is set
    if (
      props.activeChannel === null ||
      props.activeChannel !== props.match.params.id
    ) {
      setActiveChannel(props.match.params.id);
    }
    if (props.activeChannel) {
      seeThisChannel();
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

        simpleCrypto.setSecret(decryptedChannelSecret);
        setCryptoEnabled(true);
      } catch (err) {
        console.error(new Error(err));
      }
    }
  };

  const seeThisChannel = () => {
    const index = unreadDMs.findIndex(item => item.id === props.activeChannel);
    setUnreadDMs(unreadDMs.splice(index));
  };

  useEffect(() => {
    seeThisChannel();
  }, [props.activeChannel]);

  useEffect(() => {
    updateCrypto();
  }, [getUserKeys.User]);

  const updateCrypto = async () => {
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

      setSimpleCrypto(simpleCrypto.setSecret(decryptedChannelSecret));
      setCryptoEnabled(true);
    } catch (err) {
      console.error(new Error(err));
    }
  };
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
      setUploadInProgress(true);
    }
    let { user, activeChannel: channel } = props;

    try {
      let url = file === null ? null : await uploadToAWS(file);

      // create the message, encrypted with the channel's key
      let newMessage = {
        text: simpleCrypto.encrypt(text.trim()),
        user,
        channel,
        file: url ? simpleCrypto.encrypt(url.url) : "",
        fileName: file !== null ? file.name : null
      };

      props.createMessage({
        variables: {
          ...newMessage
        }
      });

      setUploadInProgress(false);

      /* clear textbox */
      let chatInput = document.getElementById("chat-input");
      chatInput.value = "";
      chatInput.setAttribute("rows", 1);
      // scrollToBottom();
    } catch (err) {
      setUploadInProgress(false);
      console.error(new Error(err));
      swal(
        "Error",
        "We were unable to send your message, please try again later",
        "error"
      );
    }
  };

  const updateChannel = () => {
    setActiveChannel(null);
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

  const _subToMore = subscribeToMore => {
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
    setDmSettings(true);
  };

  let { getUserKeys } = props;
  let channel = null,
    messages = [],
    user = null;
  return (
    <Query
      query={GET_MESSAGES_FROM_CHANNEL_ID}
      variables={{ id: props.activeChannel || "" }}
      onCompleted={scrollToBottom}
    >
      {({ data = {}, subscribeToMore }) => {
        if (data.Channel) {
          _subToMore(subscribeToMore);
          channel = data.Channel;
          messages = data.Channel.messages;
        }
        if (getUserKeys.User) {
          user = getUserKeys.User;
        }

        if (channel && messages && user && cryptoEnabled) {
          messages = messages.map(m => ({
            ...m,
            text: simpleCrypto.decrypt(m.text),
            file: m.file ? simpleCrypto.decrypt(m.file) : null
          }));
          return (
            <div id="chat-wrapper">
              <div id="current-dm-channel">
                <Link to="/app">
                  <FeatherIcon icon="chevron-left" className="white db dn-ns" />
                </Link>
                <div>{normalizeName(channel.name)}</div>
                <FeatherIcon
                  icon="more-vertical"
                  className="white db pointer"
                  onClick={showDMSettings}
                />
              </div>
              {messages.length !== 0 ? (
                <ChatWindow messages={messages} user={user} />
              ) : (
                <Loader />
              )}
              <ChatInput submit={submit} uploadInProgress={uploadInProgress} />
              {dmSettings && <DMSettings />}
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

export default useGlobal(({ user, activeChannel }) => ({
  activeChannel,
  user
}))(
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
