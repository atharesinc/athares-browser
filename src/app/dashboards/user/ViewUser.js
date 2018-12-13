import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';
import Loader from '../../../components/Loader';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { showLoading } from 'react-redux-loading-bar';

class ViewUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            stats: this.props.stats
        };
    }
    componentDidMount() {
        if (!this.props.userId) {
            this.props.history.replace('/app');
        }
    }
    toEdit = () => {
        this.props.dispatch(showLoading());
    };
    render() {
        const { user, stats } = this.state;
        const { loading } = this.props;
        if (loading) {
            return (
                <div id='dashboard-wrapper'>
                    <Loader />
                </div>
            );
        }
        return (
            <div id='dashboard-wrapper'>
                <div className='particles-bg w-100 vignette shaded'>
                    <header
                        className='tc pv2 pv4-ns'
                        style={{ height: '12em' }}>
                        <div
                            className='w-100 row-center'
                            style={{ justifyContent: 'space-between' }}>
                            <Link
                                className='f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white'
                                to='/app'>
                                BACK
                            </Link>
                            <div
                                className='f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white'
                                to='/app/user/edit'
                                onClick={this.toEdit}>
                                EDIT
                            </div>
                        </div>
                        <h1 className='f4 f3-ns fw6 white'>
                            {user.firstName + ' ' + user.lastName}
                        </h1>
                        <div
                            className='br-100 pa1 br-pill ba bw2 w4 h4 center'
                            style={{
                                background: `url(${
                                    user.icon
                                }) center no-repeat`,
                                backgroundSize: 'cover'
                            }}
                        />
                    </header>
                    <a
                        target='__blank'
                        href='https://www.flickr.com/photos/becca02/6727193557'>
                        <FeatherIcon
                            icon='info'
                            className='h2 w2 white-30 hover-white ma1 pa1'
                        />
                    </a>
                </div>
                {/* user info */}
                <Scrollbars
                    style={{ width: '100%', height: '100%' }}
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}>
                    <ul className='list ph2 ph4-ns pv2 ma2 w-100 center'>
                        <h1>Info</h1>
                        <li className='flex items-center lh-copy pa3 ph0-l bb b--white-30'>
                            <FeatherIcon
                                className='w2 h2 w2-ns h2-ns pa1'
                                icon='phone'
                            />
                            <div className='pl3 flex-auto'>
                                <span className='f6 db white-70'>Phone</span>
                            </div>
                            <div>
                                <div className='f6 link white-70'>
                                    {user.phone || 'Not set'}
                                </div>
                            </div>
                        </li>
                        <li className='flex items-center lh-copy pa3 ph0-l bb b--white-30'>
                            <FeatherIcon
                                className='w2 h2 w2-ns h2-ns pa1'
                                icon='at-sign'
                            />
                            <div className='pl3 flex-auto'>
                                <span className='f6 db white-70'>Email</span>
                            </div>
                            <div>
                                <div className='f6 link white-70'>
                                    {user.email || 'Not set'}
                                </div>
                            </div>
                        </li>
                        <li className='flex items-center lh-copy pa3 ph0-l bb b--white-30'>
                            <FeatherIcon
                                className='w2 h2 w2-ns h2-ns pa1'
                                icon='link'
                            />
                            <div className='pl3 flex-auto'>
                                <span className='f6 db white-70'>
                                    Unique Name
                                </span>
                            </div>
                            <div>
                                <div className='f6 link white-70'>
                                    {user.uname || 'Not set'}
                                </div>
                            </div>
                        </li>
                    </ul>
                    {/* Fat Stats */}
                    <article className='ph2 ph4-ns pv2' data-name='slab-stat'>
                        <h1>Statistics</h1>
                        <dl className='dib mr5'>
                            <dd className='f6 f5-ns b ml0 white-70'>Circles</dd>
                            <dd className='f4 f3-ns b ml0'>
                                {stats.circleCount}
                            </dd>
                        </dl>
                        <dl className='dib mr5'>
                            <dd className='f6 f5-ns b ml0 white-70'>
                                Revisions Proposed
                            </dd>
                            <dd className='f4 f3-ns b ml0'>
                                {stats.revisionCount}
                            </dd>
                        </dl>
                        <dl className='dib mr5'>
                            <dd className='f6 f5-ns b ml0 white-70'>
                                Revisions Accepted
                            </dd>
                            <dd className='f4 f3-ns b ml0'>
                                {stats.passedRevisionCount}
                            </dd>
                        </dl>
                        <dl className='dib mr5'>
                            <dd className='f6 f5-ns b ml0 white-70'>
                                Times Voted
                            </dd>
                            <dd className='f4 f3-ns b ml0'>
                                {stats.voteCount}
                            </dd>
                        </dl>
                        <dl className='dib mr5'>
                            <dd className='f6 f5-ns b ml0 white-70'>
                                User Since
                            </dd>
                            <dd className='f4 f3-ns b ml0'>
                                {moment(user.createdAt).format('MM/DD/YY')}
                            </dd>
                        </dl>
                    </article>
                </Scrollbars>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userId: pull(state, 'user')
    };
}

export default withRouter(connect(mapStateToProps)(ViewUser));
