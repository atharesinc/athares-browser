import React, { withGlobal, useEffect, useGlobal } from 'reactn';
import { Info, Phone, AtSign, Hash } from 'react-feather';
import { Link, withRouter } from 'react-router-dom';
import { parseDate } from '../utils/transform';
import AtharesLoader from '../components/AtharesLoader';
import { Scrollbars } from 'react-custom-scrollbars';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import Switch from 'react-switch';
import { UPDATE_ALLOW_MARKETING_EMAIL } from '../graphql/mutations';
import { GET_USER_PREF_BY_ID } from '../graphql/queries';

function ViewUser(props) {
  const [loadingUser] = useGlobal('loadingUser');
  useEffect(() => {
    if (!props.userId) {
      props.history.replace('/app');
    }
  }, [props.history, props.userId]);

  const toEdit = () => {
    props.history.push('/app/user/edit');
  };

  const updatePref = async checked => {
    let { id } = props.data.User.prefs;

    await props.updateMarketingEmail({
      variables: {
        id,
        flag: checked,
      },
    });
  };

  const {
    loading,
    user,
    stats,
    data: { User: userPref },
  } = props;

  if (loading || !userPref || loadingUser) {
    return (
      <div
        id='dashboard-wrapper'
        style={{
          justifyContent: 'center',
        }}
      >
        <AtharesLoader />
      </div>
    );
  }
  return (
    <div id='dashboard-wrapper'>
      <div className='particles-bg w-100 vignette shaded'>
        <header className='tc pv2 pv4-ns' style={{ height: '12em' }}>
          <div
            className='w-100 row-center'
            style={{ justifyContent: 'space-between' }}
          >
            <Link
              className='f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white'
              to='/app'
            >
              BACK
            </Link>
            <div
              style={{ cursor: 'pointer' }}
              className='f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white'
              onClick={toEdit}
            >
              EDIT
            </div>
          </div>
          <h1 className='f4 f3-ns fw6 white'>
            {user.firstName + ' ' + user.lastName}
          </h1>
          <div
            className='br-100 pa1 br-pill ba bw2 w4 h4 center pointer'
            style={{
              background: `url(${user.icon}) center no-repeat`,
              backgroundSize: 'cover',
            }}
            onClick={toEdit}
          />
        </header>
        <a
          target='__blank'
          href='https://www.flickr.com/photos/becca02/6727193557'
        >
          <Info className='h2 w2 white-30 hover-white ma1 pa1' />
        </a>
      </div>
      {/* user info */}
      <Scrollbars
        style={{ width: '100%', height: '100%' }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        universal={true}
      >
        <ul className='list ph2 ph4-ns pv2 ma2 w-100 center'>
          <h1>Info</h1>
          <li
            className='flex items-center lh-copy pa3 ph0-l bb b--white-30 pointer'
            onClick={toEdit}
          >
            <Phone className='w2 h2 w2-ns h2-ns pa1' icon='phone' />
            <div className='pl3 flex-auto'>
              <span className='f6 db white'>Phone</span>
            </div>
            <div className='f6 link white'>{user.phone || 'Not set'}</div>
          </li>
          <li
            className='flex items-center lh-copy pa3 ph0-l bb b--white-30 pointer'
            onClick={toEdit}
          >
            <AtSign className='w2 h2 w2-ns h2-ns pa1' icon='at-sign' />
            <div className='pl3 flex-auto'>
              <span className='f6 db white'>Email</span>
            </div>
            <div>
              <div className='f6 link white'>{user.email || 'Not set'}</div>
            </div>
          </li>
          <li
            className='flex items-center lh-copy pa3 ph0-l bb b--white-30 pointer'
            onClick={toEdit}
          >
            <Hash className='w2 h2 w2-ns h2-ns pa1' icon='hash' />
            <div className='pl3 flex-auto'>
              <span className='f6 db white'>Unique Name</span>
            </div>
            <div>
              <div className='f6 link white'>{user.uname || 'Not set'}</div>
            </div>
          </li>
        </ul>
        {/* Fat Stats */}
        <article className='ph2 ph4-ns pv2' data-name='slab-stat'>
          <h1>Statistics</h1>
          <dl className='dib mr5'>
            <dd className='f6 f5-ns b ml0 white-70'>Circles</dd>
            <dd className='f4 f3-ns b ml0'>{stats.circleCount}</dd>
          </dl>
          <dl className='dib mr5'>
            <dd className='f6 f5-ns b ml0 white-70'>Revisions Proposed</dd>
            <dd className='f4 f3-ns b ml0'>{stats.revisionCount}</dd>
          </dl>
          <dl className='dib mr5'>
            <dd className='f6 f5-ns b ml0 white-70'>Revisions Accepted</dd>
            <dd className='f4 f3-ns b ml0'>{stats.passedRevisionCount}</dd>
          </dl>
          <dl className='dib mr5'>
            <dd className='f6 f5-ns b ml0 white-70'>Times Voted</dd>
            <dd className='f4 f3-ns b ml0'>{stats.voteCount}</dd>
          </dl>
          <dl className='dib mr5'>
            <dd className='f6 f5-ns b ml0 white-70'>User Since</dd>
            <dd className='f4 f3-ns b ml0'>{parseDate(user.createdAt, 'P')}</dd>
          </dl>
        </article>
        <article className='ph2 ph4-ns pv2'>
          <h1>User Preferences</h1>

          {userPref.prefs && (
            <div className='mv2 ml3'>
              <label
                htmlFor='allowMarketingEmail'
                className='flex flex-row justify-between items center'
              >
                <div className='f6'>Allow Marketing Emails</div>
                <Switch
                  height={23}
                  onChange={updatePref}
                  checked={userPref.prefs.maySendMarketingEmail}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onColor={'#00DFFC'}
                  id='allowMarketingEmail'
                />
              </label>
            </div>
          )}
        </article>
      </Scrollbars>
    </div>
  );
}

export default withRouter(
  withGlobal(({ user }) => ({ userId: user }))(
    compose(
      graphql(UPDATE_ALLOW_MARKETING_EMAIL, { name: 'updateMarketingEmail' }),
      graphql(GET_USER_PREF_BY_ID, {
        options: ({ userId }) => {
          return { variables: { id: userId || '' } };
        },
      }),
    )(ViewUser),
  ),
);
