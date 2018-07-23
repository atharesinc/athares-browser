import React from 'react';
import Message from './Message';
import {Scrollbars} from "react-custom-scrollbars";

const ChatWindow = ({...props, messages = []}) => {
	return (
		<div id="chat-window">
		      <Scrollbars style={{ width: '100vw', height: '100vw' }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
			<div id="chat-window-inner">
				{messages.length !== 0
					?
					messages.map((msg) =>
						<Message
							isMine={msg.user.id === props.user.id ? true : false}
							{...msg}
							key={msg.id}
							timestamp={msg.createdAt} />
					)
					:
					<div id="no-messages">There are no messages in this conversation.</div>
				}
			</div>
			</Scrollbars>
		</div>
	)
};


export default ChatWindow;