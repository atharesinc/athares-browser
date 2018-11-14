import React from 'react';
import moment from 'moment';

const Message = props => {
    const timestamp =
        props.timestamp.substring(0, 10) === moment().format('YYYY-MM-DD')
            ? 'Today ' + moment(props.timestamp).format('h:mma')
            : moment(props.timestamp).format('dddd h:mma');

    const toggleTimestamp = e => {
        let timestampDiv = e.currentTarget.nextSibling;
        timestampDiv.className =
            'message-timestamp ' +
            (timestampDiv.className.includes('dn') ? '' : 'dn');
    };
    return (
        <div className='message-wrapper'>
            {props.multiMsg === false && !props.isMine && (
                <div style={{ color: '#FFFFFF', fontSize: '0.8em' }}>
                    {props.user.firstName}
                </div>
            )}
            <div className='message-content-wrapper' onClick={toggleTimestamp}>
                {props.multiMsg === false && (
                    <img
                        className='message-icon'
                        src={props.user.icon}
                        alt={props.user.firstName}
                    />
                )}{' '}
                <div
                    className={`message-content ${
                        props.isMine ? 'my-msg' : ''
                    }`}>
                    {props.text}
                </div>
            </div>

            <div className={'message-timestamp dn'}>{timestamp}</div>
        </div>
    );
};
export default Message;
