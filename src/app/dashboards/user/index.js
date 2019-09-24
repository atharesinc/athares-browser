import React, { Component } from 'react';
import ViewUser from './ViewUser';
import EditUser from './EditUser';
import ViewOtherUser from './ViewOtherUser'; // same as view user w/o btns to toggle
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { Query } from 'react-apollo';
import { GET_USER_BY_ID_ALL } from '../../../graphql/queries';

class User extends Component {
  state = {
    loading: false,
    user: null,
    voteCount: 0,
    revisionCount: 0,
    circleCount: 0,
    passedRevisionCount: 0,
  };
  componentDidMount() {
    // if a user is logged in OR location params exist to see another user
    if (/user\/.+/.test(this.props.location.pathname)) {
      this.setState({
        loading: false,
      });
    } else if (!this.props.user) {
      this.props.history.replace('/app');
    }
  }
  render() {
    return (
      <Query
        query={GET_USER_BY_ID_ALL}
        variables={{ id: this.props.user || '' }}
        pollInterval={1500}
      >
        {({ loading, err, data = {} }) => {
          let user,
            stats = null;
          if (data.User) {
            user = data.User;
            stats = {
              voteCount: user.votes.length,
              circleCount: user.circles.length,
              revisionCount: user.revisions.length,
              passedRevisionCount: user.revisions.filter(r => r.passed).length,
            };
          }
          const { match } = this.props;

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
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    pub: pull(state, 'pub'),
    circles: pull(state, 'circles'),
    votes: pull(state, 'votes'),
    revisions: pull(state, 'revisions'),
  };
}

export default connect(mapStateToProps)(User);
