// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { graphql } from "react-apollo";
import { getUserLocal } from "../graphql/queries";

const PrivateRoute = ({ component: Component, getUserLocal, ...rest }) => {
    const { error, loading, user } = getUserLocal;
    if (loading) {
        return null;
    }
    if (error) {
        return null;
    }
    if (user.id !== "") {
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

export default graphql(getUserLocal, { name: "getUserLocal" })(PrivateRoute);
