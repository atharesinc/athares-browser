import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import { updateChannel, updateRevision } from "../../../store/state/actions";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import Gun from "gun/gun";
import moment from "moment";

class Chat extends Component {
    constructor(){
        super();
        this.state = {
            messages: [],
            user: null,
            channel: null
        };
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        
        if(this.props.activeChannel){
            this._isMounted && this.getMessages();
        } else {
            this.props.dispatch(updateChannel(this.props.match.params.id));
            this.props.dispatch(updateRevision(null));
        }
        if(this.props.user !== null){
            this._isMounted && this.getUser();
        }
                /* scroll to bottom */
        let chatBox = document.getElementById("chat-window");
        if (chatBox) {
            chatBox = chatBox.firstElementChild.firstElementChild;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeChannel !== this.props.activeChannel) {
            this._isMounted && this.getMessages();
        }
        if (prevProps.messages.length !== this.props.messages.length) {
            let chatBox = document.getElementById("chat-window");
            if (chatBox) {
                /* scroll to bottom */
                chatBox = chatBox.firstElementChild.firstElementChild;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    };
    componentWillUnmount(){
        this._isMounted = false;
    }
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
    getMessages = async () => {
        this.props.gun.get(this.props.activeChannel).open(thisChannel => {
            let {messages, ...channel} = thisChannel;
            if(messages === undefined) {
                messages = []
            }
            this.setState({
                channel, 
                messages: Object.values(messages)
            })
        });
    }
    updateChannel = () => {
        this.props.dispatch(updateChannel(null));
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
        gunRef
            .get(this.props.activeChannel)
            .get("messages")
            .set(message);

        // and the reference in this user
        // let user = this.props.gun.user();
        // user.get("circles")
        //     .get(this.props.activeCircle)
        //     .get("channels")
        //     .get(this.props.activeChannel)
        //     .get("messages")
        //     .set(message);

        /* clear textbox */
        chatInput.value = "";
        chatInput.setAttribute("rows", 1);

        /* scroll to bottom */
        let chatBox = document.getElementById("chat-window").firstElementChild
            .firstElementChild;
        chatBox.scrollTop = chatBox.scrollHeight;
    };
    render() {
        // let { user, messages, channel } = this.state;
        // let { messages, channels } = this.props;
        let {user} = this.state;

        let channel, messages;

        if(this.props.user){
            channel = this.props.channels.find(c => c.id === this.props.activeChannel);
            messages = channel ? this.props.messages
                .filter(m => m.channel === channel.id)
                .sort((a, b) => a.createdAt > b.createdAt) : [];
        } else {
            channel = this.state.channel;
            messages = this.state.messages;
        }
        if (channel) {

            return (
                <div id="chat-wrapper">
                    <div id="current-channel">
                        <Link to="/app">
                            <FeatherIcon
                                icon="chevron-left"
                                className="white db dn-ns"
                                onClick={this.updateChannel}
                            />
                        </Link>
                        <div>{channel.name}</div>
                        <div className="f6 dn db-ns" style={{background: "none",color: "#FFFFFF80"}}>{channel.description}</div>
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
