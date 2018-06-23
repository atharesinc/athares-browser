import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { compose, graphql } from "react-apollo";
import {
    getActiveChannel,
    getUserLocal,
    getChannelMessages
} from "../../../graphql/queries";
import { subToChannel } from "../../../graphql/subscriptions";
import { createMessage } from "../../../graphql/mutations";

class Chat extends Component {
    submit = async text => {
        let chatInput = document.getElementById("chat-input");

        try {
            //  /* create message and send to API */
            await this.props.createMessage({
                variables: {
                    text: text.trim(),
                    userId: this.props.getUserLocal.user.id,
                    channelId: this.props.getActiveChannel.activeChannel.id
                }
            });

            //  /* refetch messages */
            this.props.getChannelMessages.refetch({
                id: this.props.getActiveChannel.activeChannel.id
            });
            /* clear textbox */
            chatInput.value = "";
            chatInput.setAttribute("rows", 1);
            /* scroll to bottom */
            let chatBox = document.getElementById("chat-window-inner");
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (err) {
            console.log(err);
            // swal("Oops", "There was an error connecting to the server", "error");
        }
    };
    componentDidMount() {
        this.props.getChannelMessages.refetch({
            id: this.props.getActiveChannel.activeChannel.id
        });
        this.props.getChannelMessages.subscribeToMore({
            document: subToChannel,
            variables: { id: this.props.getActiveChannel.activeChannel.id },
            updateQuery: (prev, { subscriptionData }) => {
                this.props.getChannelMessages.refetch({
                    id: this.props.getActiveChannel.activeChannel.id
                });
            }
        });
    }
    componentDidUpdate() {
        this.props.getChannelMessages.refetch({
            id: this.props.getActiveChannel.activeChannel.id
        });
    }
    render() {
        const { err, loading, Channel } = this.props.getChannelMessages;
        const { user } = this.props.getUserLocal;
        if (err) {
            return <div id="chat-wrapper">{err}</div>;
        }
        if (loading) {
            return (
                <div id="chat-wrapper">
                    <Loader />
                </div>
            );
        }
        if (Channel) {
            return (
                <div id="chat-wrapper">
                    <div id="current-channel">
                        <Link to="/app">
                            <FeatherIcon
                                icon="chevron-left"
                                className="white db dn-ns"
                            />
                        </Link>
                        <div>{Channel.name}</div>
                        <FeatherIcon
                            icon="more-vertical"
                            className="white db dn-ns"
                        />
                    </div>
                    <ChatWindow messages={Channel.messages} user={user} />
                    <ChatInput submit={this.submit} />
                </div>
            );
        } else {
            return null;
        }
    }
}

export default compose(
    graphql(getActiveChannel, { name: "getActiveChannel" }),
    graphql(getUserLocal, { name: "getUserLocal" }),
    graphql(createMessage, { name: "createMessage" }),
    graphql(getChannelMessages, {
        name: "getChannelMessages",
        options: ({ id }) => ({
            variables: { id: id || "" }
        })
    }),
    graphql(subToChannel, {
        name: "subToChannel",
        options: ({ id }) => ({
            variables: { id: id || "" }
        })
    })
)(Chat);
