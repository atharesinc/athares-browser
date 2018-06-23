import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import RevisionBoard from "./RevisionBoard";
import ViewRevision from "./ViewRevision";

export default class Revisions extends Component {
	render() {
		const { match } = this.props;
		console.log(this.props);

		return (
			<Switch>
				<Route
					exact
					path={`${match.path}/`}
					component={() => <RevisionBoard id={match.params.id} />}
				/>
				<Route
					exact
					path={`${match.path}/:id`}
					component={() => <ViewRevision id={match.params.id} />}
				/>
			</Switch>
		);
	}
}
