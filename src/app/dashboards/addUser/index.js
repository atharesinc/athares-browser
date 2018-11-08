import React, { Fragment } from 'react';
import CircleInviteList from './CircleInviteList';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { updateCircle } from '../../../store/state/actions';
import { withGun } from 'react-gun';
import swal from 'sweetalert';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';

class addUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUsers: [],
            suggestions: []
        };
        this._isMounted = false;
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user && !this.props.user) {
            this.props.history.push('/app');
        }
    }
    componentDidMount() {
        this._isMounted = true;
        if (!this.props.user) {
            this.props.history.push('/app');
        }
        if (
            !this.props.activeCircle ||
            this.props.activeCircle !== this.props.match.params.id
        ) {
            this.props.dispatch(updateCircle(this.props.match.params.id));
        } else {
            this._isMounted && this.getUsers();
        }
    }
    getUsers = () => {
        let gunRef = this.props.gun;
        gunRef.get('users').synclist(obj => {
            let users = [];

            // painstakingly get all the users
            // maybe a task for a webworker?
            if (obj.list) {
                obj.list.forEach(pub => {
                    if (pub === this.props.pub) {
                        return;
                    }
                    let thisUser = gunRef.user(pub);
                    thisUser.get('profile').once(user => {
                        users.push({
                            ...user,
                            name: user.firstName + ' ' + user.lastName
                        });
                    });
                });
            }

            this._isMounted &&
                this.setState({
                    suggestions: users
                });
        });
    };
    componentWillUnmount() {
        this._isMounted = false;
    }
    updateList = items => {
        this.setState({
            selectedUsers: items
        });
    };
    onSubmit = e => {
        e.preventDefault();
        let gunRef = this.props.gun;
        // double check that all users in state are NOT currently in circle

        // add each user to circle
        let { selectedUsers } = this.state;
        selectedUsers.map(thisUser => {
            gunRef.get(thisUser.circleChain).set(this.props.activeCircle);
        });
        swal(
            'User Added',
            `${
                selectedUsers.length > 1 ? 'These users have' : 'This user has'
            } been added.`,
            'success'
        );
        this.props.history.push('/app');
        // clear state
        this.setState({
            users: []
        });
    };
    render() {
        const { suggestions, selectedUsers } = this.state;
        return (
            <div id='revisions-wrapper'>
                <div className='flex db-ns ph2 mobile-nav'>
                    <Link
                        to='/app'
                        className='flex justify-center items-center'>
                        <FeatherIcon
                            icon='chevron-left'
                            className='white db dn-ns'
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className='ma3 lh-title white'> Invite Users </h2>
                </div>
                <form
                    className='pa4 white wrapper mobile-body'
                    onSubmit={this.onSubmit}
                    id='create-circle-form'
                    style={{
                        overflowY: 'scroll'
                    }}>
                    <article className='cf'>
                        <time className='f7 ttu tracked white-60'>
                            Add existing users to participate in this circle
                        </time>
                        <div className='fn mt4'>
                            <div
                                className='mb4 ba b--white-30'
                                id='circle-invite-list'>
                                <CircleInviteList
                                    shouldPlaceholder={
                                        this.state.selectedUsers.length === 0
                                    }
                                    updateList={this.updateList}
                                    suggestions={suggestions}
                                    selectedUsers={selectedUsers}
                                />
                            </div>
                        </div>
                    </article>
                    <div id='comment-desc' className='f6 white-60'>
                        After pressing "Invite", the recipient(s) may be added
                        automatically to this circle.
                        <br />
                        <br />
                        Invitations are public information, but aren't subject
                        to democratic process.
                    </div>
                    <button
                        id='create-circle-button'
                        className='btn mt4'
                        type='submit'>
                        Invite Users
                    </button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        pub: pull(state, 'pub'),
        activeCircle: pull(state, 'activeCircle')
    };
}

export default withGun(connect(mapStateToProps)(addUser));
