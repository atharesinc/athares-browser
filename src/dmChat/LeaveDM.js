import React, { useState } from 'react';
import swal from 'sweetalert';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { updateChannel } from '../store/state/actions';
import {
  DELETE_USER_FROM_DM,
  DELETE_USER_KEY,
  UPDATE_CHANNEL_NAME,
} from '../graphql/mutations';
import { GET_USERS_BY_CHANNEL_ID } from '../graphql/queries';
import { closeDMSettings } from '../store/ui/actions';
import { withRouter } from 'react-router-dom';

function LeaveDM (){
  leave = () => {
    let { activeChannel, user, updateChannelName } = props;

    try {
      swal("Are you sure you'd like to leave this Channel?", {
        buttons: {
          cancel: 'Not yet',
          confirm: true,
        },
      }).then(async value => {
        if (value === true) {
          // real quick, get the existing channel's name, and remove our name from it
          let channelName = props.getUsers.Channel.users
            .filter(u => u.id !== user)
            .map(u => u.firstName + ' ' + u.lastName)
            .join(', ');

          updateChannelName({
            variables: {
              id: activeChannel,
              name: channelName,
            },
          });
          let res = await props.deleteUserFromDM({
            variables: {
              user,
              channel: activeChannel,
            },
          });
          let { id } = res.data.removeFromUsersOnChannels.usersUser.keys[0];

          await props.deleteUserKey({
            variables: {
              id,
            },
          });

          swal(
            'Removed From Channel',
            `You have left this channel. You will have to be re-invited to participate at a later time.`,
            'warning',
          );
          props.dispatch(updateChannel(null));
          props.dispatch(closeDMSettings());
          props.history.push(`/app`);
        }
      });
    } catch (err) {
      console.error(new Error(err));
      swal('Error', 'There was an error leaving this channel.', 'error');
    }
  };
  
    return (
      <div className='pa3 ba b--red'>
        <article className='mb3'>
          <time className='f5 lh-copy white'>Leave Channel</time>
        </article>
        <div id='comment-desc' className='f6 white-80'>
          By pressing "Leave Channel" you will be removed from this channel, and
          any messages or files you shared will not be accessible by you.
          <br />
          If you would like to return to this channel at a later date, you will
          need to be re-invited by someone inside the channel.
        </div>

        <button
          id='create-circle-button'
          className='btn-red mt4'
          onClick={leave}
        >
          Leave Channel
        </button>
      </div>
    );
}
function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeChannel: pull(state, 'activeChannel'),
  };
}
export default withRouter(
  connect(mapStateToProps)(
    compose(
      graphql(GET_USERS_BY_CHANNEL_ID, {
        name: 'getUsers',
        options: ({ activeChannel }) => ({
          variables: { id: activeChannel || '' },
        }),
      }),
      graphql(UPDATE_CHANNEL_NAME, { name: 'updateChannelName' }),
      graphql(DELETE_USER_FROM_DM, { name: 'deleteUserFromDM' }),
      graphql(DELETE_USER_KEY, { name: 'deleteUserKey' }),
    )(LeaveDM),
  ),
);
