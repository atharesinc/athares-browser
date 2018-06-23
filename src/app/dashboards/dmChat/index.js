import React, { PureComponent } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
// import Loader from "../../Loader";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

export default class Chat extends PureComponent {
	constructor(props) {
		super();
	}
	isSubmit = async text => {
		let chatInput = document.getElementById("chat-input");

		try {
			// 	/* create message and send to API */
			// 	await this.props.createMessageMutation({
			// 		variables: {
			// 			text: text.trim(),
			// 			user_id: this.props.user._id,
			// 			circle_id: this.props.activeCircle._id,
			// 			channel_id: this.props.channel._id,
			// 		}
			// 	});

			// 	/* refetch messages */
			// 	this.props.getMessagesQuery.refetch();
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

	render() {
		return (
			<div id="chat-wrapper">
				<div id="current-channel">
					<Link to="/app">
						<FeatherIcon
							icon="chevron-left"
							className="white db dn-ns"
						/>
					</Link>
					<div>Test</div>
					<FeatherIcon
						icon="more-vertical"
						className="white db dn-ns"
					/>
				</div>
				<ChatWindow />
				<ChatInput isSubmit={this.isSubmit} />
			</div>
		);
	}
}

// const createMessageMutation = gql`
// 	mutation createMessageMutation($text: String!, $user_id : ID!,  $circle_id : ID!, $channel_id : ID!){
// 		createMessage(text: $text, user_id: $user_id, circle_id: $circle_id, channel_id: $channel_id){
// 			_id
// 			text
// 			createdAt
// 		}
// 	}
// `;
// const getMessagesQuery = gql`
// 	query getMessagesQuery($channel_id: ID!){
// 		getMessages(channel_id: $channel_id){
// 			_id
// 			text
// 			createdAt
// 			user_id
// 			user {
// 				firstName
// 				lastName
// 				icon
// 			}
// 		}
// 	}
// `;

// export default compose(
// 	graphql(getMessagesQuery,
// 		{
// 			name: "getMessagesQuery",
// 			options: (props) => ({ variables: { channel_id: props.channel._id } })
// 		}
// 	),
// 	graphql(createMessageMutation,
// 		{
// 			name: "createMessageMutation",
// 			refetchQueries: [{
// 				query: getMessagesQuery,
// 				options: (props) => ({ variables: { channel_id: props.channel._id } })
// 			}]
// 		}
// 	))(Chat)
