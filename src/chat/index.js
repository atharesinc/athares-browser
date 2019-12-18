import React, { useState } from "reactn";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import Loader from "../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import {
  updateChannel,
  updateRevision,
  updateCircle,
  removeUnreadChannel
} from "../store/state/actions";

import { CREATE_MESSAGE } from "../graphql/mutations";
import { SUB_TO_MESSAGES_BY_CHANNEL_ID } from "../graphql/subscriptions";
import { GET_MESSAGES_FROM_CHANNEL_ID } from "../graphql/queries";
import { graphql, Query } from "react-apollo";
import compose from "lodash.flowright";
import swal from "sweetalert";
import { uploadToAWS } from "utils/upload";

function Chat (){
  
      const [uploadInProgress, setUploadInProgress] = useState( false)
    const [user] = useGlobal("user"),
    const [activeChannel, setActiveChannel] = useGlobal("activeChannel"),
    const [activeCircle, setActiveCircle] = useGlobal("activeCircle")
  
useEffect(()=>{
 componentMount();
}, [])

const componentMount =  ()  => {
    const circleId = props.match.url.match(
      /app\/circle\/(.+)\/channel/
    )[1];

    if (circleId) {
      setActiveCircle(circleId);
    }

    if (!activeChannel) {
      setActiveChannel(props.match.params.id);
     setRevision(null);
      return;
    }
    // if (activeChannel) {
    //   props.dispatch(removeUnreadChannel(props.match.params.id));
    // }
  }
  componentDidUpdate(prevProps) {
    // if current url doesn't match internal state, update state to match url
    if (props.match.params.id !== props.activeChannel) {
     setActiveChannel(props.match.params.id);
      // props.dispatch(removeUnreadChannel(props.match.params.id));
    }
    if (
      activeChannel &&
      activeChannel !== prevProps.activeChannel
    ) {
      dispatch(removeUnreadChannel(props.match.params.id));
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
  const updateChannel = () => {
    props.dispatch(updateChannel(null));
  };

  const submit = async (text, file = null) => {
    let chatInput = document.getElementById("chat-input");

    if (file) {
      setUploadInProgress(true)
    }

    try {
      let url = file === null ? null : await uploadToAWS(file);

      if (file) {
        fetch(url);
      }

      let newMessage = {
        text: text.trim(),
        channel: props.activeChannel,
        user: props.user,
        file: file !== null ? url.url : null,
        fileName: file !== null ? file.name : null
      };

      let newMessageRes = await props.createMessage({
        variables: {
          ...newMessage
        }
      });

      newMessage.id = newMessageRes.data.createMessage.id;

      /* clear textbox */
      chatInput.value = "";
      chatInput.setAttribute("rows", 1);
      setUploadInProgress(false)

      /* scroll to bottom */
      this.scrollToBottom();
    } catch (err) {
     setUploadInProgress(false)
      console.error(new Error(err));
      swal(
        "Error",
        "We were unable to send your message, please try again later",
        "error"
      );
    }
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
  
    let channel = null;
    let messages = [];
    let { user } = props;

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

          if (channel) {
            return (
              <div id="chat-wrapper">
                <div id="current-channel">
                  <Link to="/app">
                    <FeatherIcon
                      icon="chevron-left"
                      className="white db dn-l"
                      onClick={this.updateChannel}
                    />
                  </Link>
                  <div>{channel.name}</div>
                  <div
                    className="f6 dn db-ns"
                    style={{ background: "none", color: "#FFFFFF80" }}
                  >
                    {channel.description}
                  </div>
                  {/* <FeatherIcon
                            icon="more-vertical"
                            className="white db dn-ns"
                        /> */}
                </div>
                <ChatWindow messages={messages} user={user} />
                {user && (
                  <ChatInput
                    submit={this.submit}
                    uploadInProgress={uploadInProgress}
                  />
                )}
              </div>
            );
          } else {
            return (
              <div id="chat-wrapper" style={{ justifyContent: "center" }}>
                <Loader />
                <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">
                  Getting Messages
                </h1>
              </div>
            );
          }
        }}
      </Query>
    );
}

export default compose(graphql(CREATE_MESSAGE, { name: "createMessage" }))(Chat);
