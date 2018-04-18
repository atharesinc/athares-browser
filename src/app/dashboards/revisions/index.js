import React, { Component } from "react";

import { Switch, Route } from "react-router-dom";

// trello dashboard
import RevisionBoard from "./RevisionBoard";
//individual revision screen
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
			</Switch>
		);
	}
}
