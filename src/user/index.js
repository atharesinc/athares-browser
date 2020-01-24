import React, { useState, useEffect, useGlobal } from 'reactn';
import ViewUser from './ViewUser';
import EditUser from './EditUser';
import ViewOtherUser from './ViewOtherUser'; // same as view user w/o btns to toggle
import { Switch, Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import { GET_USER_BY_ID_ALL } from '../graphql/queries';

function User(props) {
  const [user] = useGlobal('user');
  const [, setLoadingUser] = useState(false);

  useEffect(() => {
    // if a user is logged in OR location params exist to see another user
    if (/user\/.+/.test(props.location.pathname)) {
      setLoadingUser(true);
    } else if (!user) {
      props.history.replace('/app');
    }
  }, [user, props.history, setLoadingUser, props.location.pathname]);

  return (
    <Query
      query={GET_USER_BY_ID_ALL}
      variables={{ id: user || '' }}
      // re-enable
      // pollInterval={1500}
    >
      {({ loading, err, data = {} }) => {
        let userObj,
          stats = null;
        if (data.user) {
          userObj = data.user;
          stats = {
            voteCount: userObj.votes.length,
            circleCount: userObj.circles.length,
            revisionCount: userObj.revisions.length,
            passedRevisionCount: userObj.revisions.filter(r => r.passed).length,
          };
        }
        const { match } = props;

        return (
          <Switch>
            <Route
              exact
              path={`${match.path}`}
              component={props => (
                <ViewUser stats={stats} user={userObj} loading={loading} />
              )}
            />
            )
            <Route
              exact
              path={`${match.path}/edit`}
              component={props => <EditUser {...props} user={userObj} />}
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

export default User;
