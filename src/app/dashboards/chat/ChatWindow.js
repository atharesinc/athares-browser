import React from 'react';
import Message from './Message';
import { Scrollbars } from 'react-custom-scrollbars';

const ChatWindow = ({ messages = [], user, ...props }) => {
    if (!user) {
        user = {
            id: ''
        };
    }

    return (
        <div id='chat-window'>
            {messages.length !== 0 ? (
                <Scrollbars
                    style={{ width: '100%', height: user ? '90vh' : '80vh' }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}>
                    {messages.map((msg, i) => {
                        // if the user sends multiple consecutive messages we don't need to append the username and image to every message
                        return (
                            <Message
                                multiMsg={
                                    i !== 0 &&
                                    messages[i - 1].user.id ===
                                        messages[i].user.id
                                }
                                isMine={msg.user.id === user.id ? true : false}
                                {...msg}
                                key={msg.id}
                                timestamp={msg.createdAt}
                                lastMessage={i}
                            />
                        );
                    })}
                </Scrollbars>
            ) : (
                <div id='no-messages'>
                    There are no messages in this channel.
                    <br />
                    {user.id !== '' && 'Start typing to begin the conversation'}
                </div>
            )}
        </div>
    );
};

export default ChatWindow;

/*
 <Transition
                        items={messages}
                        keys={item => item.id}
                        from={{ transform: "translate3d(0,40px,0)" }}
                        enter={{ transform: "translate3d(0,0px,0)" }}
                        leave={{ transform: "translate3d(0,40px,0)" }}
                    >
                        {/*messages.map((msg, i) => 
                        // if the user sends multiple consecutive messages we don't need to append the username and image to every message
                            <Message
                                                            multiMsg={
                                                                i !== 0 &&
                                                                messages[i - 1].user.id ===
                                                                    messages[i].user.id
                                                            }
                                                            isMine={msg.user.id === user.id ? true : false}
                                                            {...msg}
                                                            key={msg.id}
                                                            timestamp={msg.createdAt}
                                                            lastMessage={i}
                                                        />
                            <div key={msg.id}>{msg.text}</div>
                    )}
                        {item => props => <Message
                                                            multiMsg={false}
                                                            isMine={item.user.id === user.id ? true : false}
                                                            {...item}
                                                            key={item.id}
                                                            timestamp={item.createdAt}
                                                            lastMessage={0}
                                                        />}
                    </Transition>*/
