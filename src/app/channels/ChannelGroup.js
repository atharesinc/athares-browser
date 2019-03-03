import React from "react";
import Channel from "./Channel";
import ChannelLabel from "./ChannelLabel";

/*
    A Group of Channels. This acts as the iterator for individual channels
    Takes as props an array of channels. 
    (See Channel.js)
*/
const ChannelGroup = props => {
  return (
    <div className="channel-group-wrapper openDown">
      {props.name ? (
        <ChannelLabel
          name={props.name}
          channelType={props.channelType}
          activeCircle={props.activeCircle}
          isTop={true}
          activeChannel={props.activeChannel}
        />
      ) : null}

      {props.channels.map((channel, i) => (
        <Channel
          key={i}
          channel={channel}
          activeChannel={props.activeChannel}
          user={props.user}
        />
      ))}
    </div>
  );
};

export default ChannelGroup;
