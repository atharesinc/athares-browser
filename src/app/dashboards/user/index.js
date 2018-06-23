import React, { Component } from "react";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import ViewOtherUser from "./ViewOtherUser"; // same as view user w/o btns to toggle
import { Switch, Route } from "react-router-dom";
import { getUserLocal, getUserRemote } from "../../../graphql/queries";
import Loader from "../../Loader";
import { compose, graphql } from "react-apollo";

class User extends Component {
	componentDidMount() {
		this.props.getUserRemote.refetch({
			id: this.props.getUserLocal.user.id
		});
	}
	render() {
		console.log(this.props.getUserRemote);
		const { loading, error, User } = this.props.getUserRemote;
		if (loading) {
			return (
				<div
					id="dashboard-wrapper"
					style={{
						justifyContent: "center"
					}}
					className="pa2"
				>
					<Loader />
					<h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">
						Getting User Information
					</h1>
				</div>
			);
		} else if (error) {
			return <div>Loading</div>;
		} else if (User) {
			const { match } = this.props;
			return (
				<Switch>
					<Route
						exact
						path={`${match.path}`}
						component={props => <ViewUser {...props} user={User} />}
					/>
					<Route
						exact
						path={`${match.path}/edit`}
						component={props => <EditUser {...props} user={User} />}
					/>
					<Route
						exact
						path={`${match.path}/:id`}
						component={props => <ViewOtherUser {...props} />}
					/>
				</Switch>
			);
		} else {
			return null;
		}
	}
}
export default compose(
	graphql(getUserLocal, { name: "getUserLocal" }),
	graphql(getUserRemote, {
		name: "getUserRemote",
		options: ({ id }) => ({ variables: { id: id || "" } })
	})
)(User);
