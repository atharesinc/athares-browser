import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import RevisionBoard from "./RevisionBoard";
import ViewRevision from "./ViewRevision";

export default class Revisions extends Component {
    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route
                    exact
                    path={`${match.path}/`}
                    component={RevisionBoard}
                />
                <Route
                    exact
                    path={`${match.path}/:id`}
                    component={ViewRevision}
                />
                <Route
                    component={props => {
                        props.history.push(`/app/${match.path}/`);
                        return null;
                    }}
                />
            </Switch>
        );
    }
}