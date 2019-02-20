import React, { Component } from "react";
import ChatWindow from "../../../components/ChatWindow";
import ChatInput from "../../../components/ChatInput";
import Loader from "../../../components/Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import {
  updateChannel,
  updateRevision,
  updateCircle
} from "../../../store/state/actions";
// import { updateDesc, updateTitle } from "../../../store/head/actions";
import { connect } from "react-redux";
import { CREATE_MESSAGE } from "../../../graphql/mutations";
import { GET_MESSAGES_FROM_CHANNEL_ID } from "../../../graphql/queries";
import { compose, graphql, Query } from "react-apollo";
import swal from "sweetalert";
import uploadToIPFS from "../../../utils/uploadToIPFS";

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      user: null,
      channel: null,
      uploadInProgress: false
    };
    this._isMounted = false;
  }
  componentDidMount() {
    const circleId = this.props.match.url.match(
      /app\/circle\/(.+)\/channel/
    )[1];

    if (circleId) {
      this.props.dispatch(updateCircle(circleId));
    }

    if (!this.props.activeChannel) {
      this.props.dispatch(updateChannel(this.props.match.params.id));
      this.props.dispatch(updateRevision(null));
      return;
    }
  }
  componentDidUpdate(prevProps) {
    // if current url doesn't match internal state, update state to match url
    if (this.props.match.params.id !== this.props.activeChannel) {
      this.props.dispatch(updateChannel(this.props.match.params.id));
      return;
    }
    if (
      this.props.messages &&
      this.props.messages.length > prevProps.messages.length
    ) {
      // /* scroll to bottom */
      // this.scrollToBottom()
    }
  }
  scrollToBottom = () => {
    let chatBox = document.getElementById("chat-window-scroller");
    let lastMsg = document.getElementById("last-message");
    if (chatBox) {
      chatBox.scrollTop = lastMsg.scrollHeight;
    }
  };
  updateChannel = () => {
    this.props.dispatch(updateChannel(null));
  };
  updateProgress = (prog, length) => {
    console.log(prog / length);
  };

  submit = async (text, file = null) => {
    let chatInput = document.getElementById("chat-input");

    await this.setState({
      uploadInProgress: true
    });

    try {
      let url =
        file === null ? null : await uploadToIPFS(file, this.updateProgress);
      if (file) {
        fetch(url);
      }
      let newMessage = {
        text: text.trim(),
        channel: this.props.activeChannel,
        user: this.props.user,
        file: url,
        fileName: file !== null ? file.name : null
      };

      let newMessageRes = await this.props.createMessage({
        variables: {
          ...newMessage
        }
      });

      newMessage.id = newMessageRes.data.createMessage.id;

      /* clear textbox */
      chatInput.value = "";
      chatInput.setAttribute("rows", 1);
      await this.setState({
        uploadInProgress: false
      });
      /* scroll to bottom */
      // this.scrollToBottom();
    } catch (err) {
      console.error(new Error(err));
      swal(
        "Error",
        "We were unable to send your message, please try again later",
        "error"
      );
    }
  };
  render() {
    let channel = null;
    let messages = [];
    let { user } = this.props;
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
                    uploadInProgress={this.state.uploadInProgress}
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
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel"),
    activeCircle: pull(state, "activeCircle")
  };
}

export default compose(graphql(CREATE_MESSAGE, { name: "createMessage" }))(
  connect(mapStateToProps)(Chat)
);
