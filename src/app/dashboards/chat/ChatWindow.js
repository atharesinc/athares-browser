import React from "react";
import Message from "./Message";
import { Scrollbars } from "react-custom-scrollbars";

const ChatWindow = ({ messages = [], user, ...props }) => {
  if (!user) {
    user = {
      id: ""
    };
  }
  if (messages.length > 1) {
    console.log(messages[0].user.id, messages[1].user.id);
  }
  return (
    <div id="chat-window">
      {messages.length !== 0 ? (
        <Scrollbars style={{ width: "100%", height: "80vh" }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
          {messages.map((msg, i) => (
            // if the user sends multiple consecutive messages we don't need to append the username and image to every message
            <Message
              multiMsg={i !== 0 && messages[i - 1].user.id === messages[i].user.id}
              isMine={msg.user === user.id ? true : false}
              {...msg}
              key={msg.id}
              timestamp={msg.createdAt}
            />
          ))}
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
