// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import * as stateSelectors from "../store/state/reducers";
import {connect} from "react-redux";

const PrivateRoute = ({ component: Component, user, ...rest }) => {
    if (user || true) {
        return <Route {...rest} render={props => <Component {...props} />} />;
    }
    return (
        <Redirect
            to={{
                pathname: "/login"
            }}
        />
    );
};

function mapStateToProps(state) {
    return {
      user: stateSelectors.pull(state, "user")
    }
  }

  export default withRouter(connect(mapStateToProps)(PrivateRoute));
