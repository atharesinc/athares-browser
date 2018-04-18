import React from 'react';
import Message from './Message';

const ChatWindow = ({...props, messages = []}) => {
	return (
		<div id="chat-window">
			<div id="chat-window-inner">
				{messages.length !== 0
					?
					messages.map((msg) =>
						<Message
							isMine={msg.user_id === props.user._id ? true : false}
							{...msg}
							key={msg._id}
							timestamp={msg.createdAt} />
					)
					:
					<div id="no-messages">There are no messages in this conversation.</div>
				}
			</div>
		</div>
	)
};


export default ChatWindow;