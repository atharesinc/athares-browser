import React from 'react';
import Message from './Message';
import {Scrollbars} from "react-custom-scrollbars";

const ChatWindow = ({...props, messages = []}) => {
	return (
		<div id="chat-window">
			{messages.length !== 0 ?
		    	<Scrollbars style={{ width: '100%', height: '80vh' }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
					
					{messages.map((msg) =>
						<Message
							isMine={msg.user.id === props.user.id ? true : false}
							{...msg}
							key={msg.id}
							timestamp={msg.createdAt} />
					)}
				</Scrollbars>
			:
				<div id="no-messages">There are no messages in this channel.</div>
			}
		</div>
	)
};


export default ChatWindow;