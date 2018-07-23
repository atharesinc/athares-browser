import React from 'react';
import { Link } from 'react-router-dom';
import { getActiveCircle } from '../../graphql/queries';
import { compose, graphql } from 'react-apollo';
import { Scrollbars } from 'react-custom-scrollbars';

/*
    A Group of Governance Channels
*/
const GovernanceChannelGroup = (props) => {
  const { error, loading, activeCircle } = props.getActiveCircle;
  if (error) {
    return null;
  } else if (loading) {
    return null;
  }
  return (
    <div className="channel-group-wrapper">
      <div className={`channel-group-label`} style={{ color: '#FFFFFF' }}>
        {props.name}
      </div>
      <Scrollbars style={{ width: '100%', height: 'calc(100vh /5)' }} autoHide autoHideTimeout={1000} autoHideDuration={200} universal={true}>
        <Link to={`/app/circle/${activeCircle.id}/constitution`} className={`channel-group-label gov`} style={{ borderBottom: 'none', textIndent: '1em' }}>
          Constitution
        </Link>
        <Link to={`/app/circle/${activeCircle.id}/revisions`} className={`channel-group-label gov`} style={{ borderBottom: 'none', textIndent: '1em' }}>
          Polls
        </Link>
        <Link to={`/app/circle/${activeCircle.id}/news`} className={`channel-group-label gov`} style={{ borderBottom: 'none', textIndent: '1em' }}>
          News
        </Link>
      </Scrollbars>
    </div>
  );
};

export default compose(graphql(getActiveCircle, { name: 'getActiveCircle' }))(GovernanceChannelGroup);
