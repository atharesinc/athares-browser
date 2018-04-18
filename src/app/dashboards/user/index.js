import React, { Component } from "react";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import ViewOtherUser from "./ViewOtherUser"; // same as view user w/o btns to toggle

import { Switch, Route } from "react-router-dom";

export default class User extends Component {
	render() {
		const { match } = this.props;
		return (
			<Switch>
				<Route exact path={`${match.path}`} component={ViewUser} />
				<Route exact path={`${match.path}/edit`} component={EditUser} />
				<Route
					exact
					path={`${match.path}/:id`}
					component={ViewOtherUser}
				/>
			</Switch>
		);
	}
}
