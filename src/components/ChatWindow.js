import React from "react";
import Message from "./Message";
import { Scrollbars } from "react-custom-scrollbars";

const ChatWindow = ({ messages = [], user, ...props }) => {
  if (!user) {
    user = {
      id: ""
    };
  }
  return (
    <div id="chat-window">
      {messages.length !== 0 ? (
        <Scrollbars
          style={{ width: "100%", height: "80vh" }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          universal={true}
          id="chat-window-scroller"
        >
          {messages.map((msg, i) => {
            // if the user sends multiple consecutive messages we don't need to append the username and image to every message
            return (
              <Message
                multiMsg={
                  i !== 0 && messages[i - 1].user.id === messages[i].user.id
                }
                isMine={
                  msg.user && (msg.user.id === user.id || msg.user.id === user)
                }
                {...msg}
                key={msg.id}
                timestamp={msg.createdAt}
                lastMessage={i}
              />
            );
          })}
        </Scrollbars>
      ) : (
        <div id="no-messages">
          There are no messages in this channel.
          <br />
          {user && "Start typing to begin the conversation"}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
