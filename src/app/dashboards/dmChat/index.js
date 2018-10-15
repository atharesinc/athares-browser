import React, { Component } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { pull } from "../../../store/state/reducers";
import { updateChannel } from "../../../store/state/actions";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import Gun from "gun/gun";
import moment from "moment";
import { decrypt } from "simple-asym-crypto";

class DMChat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            user: null
        };

        this._isMounted = false;
    }
    async componentDidUpdate(prevProps) {
        if (prevProps.activeChannel !== this.props.activeChannel) {
            await this.decryptMessages();
        }
    }
    scrollToBottom = () => {
        let chatBox = document.getElementById("chat-window");
        if (chatBox) {
            /* scroll to bottom */
            chatBox = chatBox.firstElementChild.firstElementChild;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };
    async componentDidMount() {
        if (this.props.user === null) {
            this.props.history.push("/app");
        }
        await this.getUser();

        // Make sure activeChannel is set
        if (
            this.props.activeChannel === null ||
            this.props.activeChannel !== this.props.match.params.id
        ) {
            this.props.dispatch(updateChannel(this.props.match.params.id));
        } else {
            await this.decryptMessages();
            let chatBox = document.getElementById("chat-window");
            if (chatBox) {
                chatBox = chatBox.firstElementChild.firstElementChild;
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }
    }
    decryptMessages = async () => {
        // clear the old messages
        const { SEA, activeChannel, dmsgs } = this.props;
        let { key } = this.props.dms.find(d => d.id === activeChannel);
        let encMessages = dmsgs.filter(d => d.channel === activeChannel);

        let pair = await this.getThisChannelsPair(key);
        // for each message, SEA decrypt the text and add it to messageState
        let res = await encMessages.map(async msg => {
            let decryptedMsg = {
                ...msg,
                text: await SEA.decrypt(msg.text, pair)
            };
            return decryptedMsg;
        });
        console.log(res);
        Promise.all(res).then(messages => {
            this.setState({
                messages
            }, this.scrollToBottom);
        })
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
    getThisChannelsPair = async keyFromKeychain => {
        const { user } = this.state;
        const { SEA, gun } = this.props;
        let gunUser = gun.user();
        // keyfrom keychain is asymmetrically encrypted SEA pair used to encrypt and decrypt channel messages
        // we need our asymmetric private key (apriv, aPriv, etc.), which can be decrypted with SEA's decrypt
        const myAPriv = await this.props.SEA.decrypt(
            user.apriv,
            gunUser.pair()
        );
        if (myAPriv === undefined) {
            console.error(SEA.error);
            return false;
        }
        // now we can decrypt our version of the key and return the object to the user for SEA encryption/decryption
        return await decrypt(keyFromKeychain, myAPriv);
    };
    submit = async text => {
        let chatInput = document.getElementById("chat-input");
        let { SEA, activeChannel } = this.props;
        // get the symmetric key pair for this channel from the channel
        let { key } = this.props.dms.find(d => d.id === activeChannel);
        // get the key we need to decrypt it
        let pair = await this.getThisChannelsPair(key);

        let newMessage = {
            id: "MS" + Gun.text.random(),
            text: await SEA.encrypt(text.trim(), pair),
            user: this.state.user,
            channel: activeChannel,
            createdAt: moment().format(),
            updatedAt: moment().format()
        };
        if (newMessage.text === undefined) {
            console.error(SEA.err);
            return false;
        }
        let gunRef = this.props.gun;
        let channel = gunRef.get(activeChannel);
        let message = gunRef.get(newMessage.id);
        message.put(newMessage);

        gunRef.get("messages").set(message);
        channel.get("messages").set(message);

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
            .filter(n => n !== this.state.user.firstName);
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
        let { dms, activeChannel } = this.props;
        let { user, messages } = this.state;
        let dm = dms.find(d => d.id === activeChannel);
        console.log(messages.length);
        if (dm && user) {
            return (
                <div id="chat-wrapper">
                    <div id="current-channel">
                        <Link to="/app">
                            <FeatherIcon
                                icon="chevron-left"
                                className="white db dn-ns"
                            />
                        </Link>
                        <div>{this.normalizeName(dm.name)}</div>
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
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeChannel: pull(state, "activeChannel"),
        dmsgs: pull(state, "dmsgs"),
        dms: pull(state, "dms")
    };
}

export default withGun(connect(mapStateToProps)(DMChat));