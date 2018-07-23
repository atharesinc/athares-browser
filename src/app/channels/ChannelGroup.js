import React from 'react';
import Channel from './Channel';
import ChannelLabel from './ChannelLabel';
import { Scrollbars } from 'react-custom-scrollbars';

/*
    A Group of Channels. This acts as the iterator for individual channels
    Takes as props an array of channels. 
    (See Channel.js)
*/
const ChannelGroup = (props) => {
  return (
    <div className="channel-group-wrapper">
      {props.name ? <ChannelLabel name={props.name} channelType={props.channelType} activeCircle={props.activeCircle} isTop={true} activeChannel={props.activeChannel} /> : null}
      <Scrollbars style={{ width: '100%', height: 'calc(100vh /3)', paddingLeft: '1em' }} flex={1} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
        {props.channels.map((channel, i) => <Channel key={i} channel={channel} activeChannel={props.activeChannel} />)}
      </Scrollbars>
    </div>
  );
};

export default ChannelGroup;
