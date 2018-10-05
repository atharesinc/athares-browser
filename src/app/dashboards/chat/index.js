import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import Gun from "gun/gun";
import moment from "moment";

class Chat extends Component {
    state = {
        messages: [],
        user: null
    };
    componentDidMount() {
        this.getUser();
    }
    componentDidUpdate = prevProps => {
        console.log(this.props.messages.length);
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
    submit = async text => {
        let chatInput = document.getElementById("chat-input");

        let newMessage = {
            id: "MS" + Gun.text.random(),
            text: text.trim(),
            user: this.state.user,
            channel: this.props.activeChannel,
            circle: this.props.activeCircle,
            createdAt: moment().format(),
            updatedAt: moment().format()
        };

        let gunRef = this.props.gun;

        let message = gunRef.get(newMessage.id);
        message.put(newMessage);

        gunRef.get("messages").set(message);
        // gunRef
        //     .get(this.props.activeChannel)
        //     .get("messages")
        //     .set(message);

        // and the reference in this user
        let user = this.props.gun.user();
        user.get("circles")
            .get(this.props.activeCircle)
            .get("channels")
            .get(this.props.activeChannel)
            .get("messages")
            .set(message);

        /* clear textbox */
        chatInput.value = "";
        chatInput.setAttribute("rows", 1);

        /* scroll to bottom */
        // let chatBox = document
        //     .getElementById("chat-window")
        //     .firstChild()
        //     .firstChild();
        // chatBox.scrollTop = chatBox.scrollHeight;
    };
    render() {
        let { user } = this.state;
        let { messages, channels } = this.props;

        let channel = channels.find(c => c.id === this.props.activeChannel);

        if (channel) {
            messages = messages
                .filter(m => m.channel === channel.id)
                .sort((a, b) => a.createdAt > b.createdAt);
            return (
                <div id="chat-wrapper">
                    <div id="current-channel">
                        <Link to="/app">
                            <FeatherIcon
                                icon="chevron-left"
                                className="white db dn-ns"
                            />
                        </Link>
                        <div>{channel.name}</div>
                        <FeatherIcon
                            icon="more-vertical"
                            className="white db dn-ns"
                        />
                    </div>
                    <ChatWindow messages={messages} user={user} />
                    {user && <ChatInput submit={this.submit} />}
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
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeChannel: pull(state, "activeChannel"),
        activeCircle: pull(state, "activeCircle"),
        messages: pull(state, "messages"),
        channels: pull(state, "channels")
    };
}

export default withGun(connect(mapStateToProps)(Chat));
