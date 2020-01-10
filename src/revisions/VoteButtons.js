import React, { Fragment } from 'reactn';
import { CheckCircle, XCircle } from 'react-feather';

const VoteButtons = ({ vote }) => {
  return (
    <Fragment>
      <small
        className='f7 white-70 db lh-copy'
        style={{ clear: 'both', padding: '1em' }}
      >
        By selecting "Accept" or "Reject" you testify that you have read the
        proposed legislation, and consider it to be necesssary, to benefit your
        circle, and is supported by reason and facts. If a law has more support
        votes than reject votes after the expiration it will become law,
        otherwise it will be discarded.
      </small>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div
          onClick={() => {
            vote(true);
          }}
          className='bg-green light-green w-50 f3 tc dim pv2 vote-btn'
        >
          <CheckCircle />
          ACCEPT
        </div>
        <div
          onClick={() => {
            vote(false);
          }}
          className='bg-red light-pink w-50 f3 tc dim pv2 vote-btn'
        >
          <XCircle />
          REJECT
        </div>
      </div>
    </Fragment>
  );
};

export default VoteButtons;
