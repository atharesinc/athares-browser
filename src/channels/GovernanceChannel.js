import React from "reactn";
import GovernanceChannelLabel from "./ChannelLabel";
import { Link } from "react-router-dom";
/*
    Component representing a single channel or group of subchannels in a circle
    Renders a row in the Channels Pane
   
*/
const GovernanceChannel = ({ click, channel, activeChannel }) => {
	return (
		<div
			className="channel-wrapper"
			data-channel-id={channel._id}
			onClick={click}
		>
			<ChannelLabel
				{...channel}
				isTop={false}
				activeChannel={activeChannel}
			/>
		</div>
	);
};

export default GovernanceChannel;
