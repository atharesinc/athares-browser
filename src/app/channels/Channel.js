import React from "react";
import ChannelLabel from "./ChannelLabel";

/*
    Component representing a single channel or group of subchannels in a circle
    Renders a row in the Channels Pane and optionally an indented list of subchannels if applicable
    Props should contain:
    {
    channel: {
        _id: <String>,
        name: <String>,
        subChannels: [<Object>],
        circle_id: <String>,
        description: <String>,
        channelType: <String>, "gov" || "group",
        parent_channel_id
    },
    onClick: f(),
    addChannel: f(),
    }
*/
const Channel = ({ click, channel, activeChannel }) => {
    return (
        <ChannelLabel
            {...channel}
            isTop={false}
            activeChannel={activeChannel}
        />
    );
};

export default Channel;
