import React, { useState, useEffect, useGlobal } from "react";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import ViewOtherUser from "./ViewOtherUser"; // same as view user w/o btns to toggle
import { Switch, Route } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_USER_BY_ID_ALL } from "../graphql/queries";

function User(props) {
  const [user] = useGlobal("user");
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if a user is logged in OR location params exist to see another user
    if (/user\/.+/.test(props.location.pathname)) {
      // setLoading(false);
    } else if (!user) {
      props.history.replace("/app");
    }
  }, []);

  return (
    <Query
      query={GET_USER_BY_ID_ALL}
      variables={{ id: user || "" }}
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
            passedRevisionCount: user.revisions.filter(r => r.passed).length
          };
        }
        const { match } = props;

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

export default User;
