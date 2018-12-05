import React, { Component } from 'react';
import ViewUser from './ViewUser';
import EditUser from './EditUser';
import ViewOtherUser from './ViewOtherUser'; // same as view user w/o btns to toggle
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withGun } from 'react-gun';
import { pull } from '../../../store/state/reducers';
import Loader from '../../../components/Loader';

class User extends Component {
    state = {
        loading: true,
        user: null,
        voteCount: 0,
        revisionCount: 0,
        circleCount: 0,
        passedRevisionCount: 0
    };
    componentDidMount() {
        // if a user is logged in OR location params exist to see another user

        if (/user\/US.+/.test(this.props.location.pathname)) {
            this.setState({
                loading: false
            });
        } else if (!!this.props.user) {
            const { votes, circles, revisions, user: id } = this.props;
            // get the logged-in user ref
            let userRef = this.props.gun.user();

            userRef.get('profile').once(user => {
                let myRevisions = revisions.filter(r => r.backer.id === id);

                this.setState({
                    user,
                    voteCount: votes.filter(v => v.user === id).length,
                    revisionCount: myRevisions.length,
                    circleCount: circles.length,
                    passedRevisionCount: myRevisions.filter(
                        r => r.passed === true
                    ).length,
                    loading: false
                });
            });
        } else {
            this.props.history.push('/app');
        }
    }
    render() {
        const { user, loading, ...stats } = this.state;
        const { match } = this.props;
        if (loading) {
            return (
                <div
                    id='dashboard-wrapper'
                    style={{
                        justifyContent: 'center'
                    }}
                    className='pa2'>
                    <Loader />
                    <h1 className='mb3 mt0 lh-title mt4 f3 f2-ns'>
                        Getting User Information
                    </h1>
                </div>
            );
        }
        return (
            <Switch>
                <Route
                    exact
                    path={`${match.path}`}
                    component={props => (
                        <ViewUser
                            {...props}
                            stats={stats}
                            user={user}
                            loading={loading}
                        />
                    )}
                />
                )
                <Route
                    exact
                    path={`${match.path}/edit`}
                    component={props => <EditUser {...props} user={user} />}
                />
                <Route
                    exact
                    path={`${match.path}/:id`}
                    component={props => <ViewOtherUser {...props} />}
                />
            </Switch>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        pub: pull(state, 'pub'),
        circles: pull(state, 'circles'),
        votes: pull(state, 'votes'),
        revisions: pull(state, 'revisions')
    };
}

export default withGun(connect(mapStateToProps)(User));
