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
const Channel = ({ click, channel, activeChannel, user }) => {
  const normalizeName = name => {
    let retval = name
      .split(", ")
      .filter(n => n !== user.firstName + " " + user.lastName);
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
  channel.name =
    channel.channelType === "dm" ? normalizeName(channel.name) : channel.name;
  return (
    <ChannelLabel {...channel} isTop={false} activeChannel={activeChannel} />
  );
};

export default Channel;
