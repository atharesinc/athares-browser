import React, { Component } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { Switch, Route } from "react-router-dom";
import { getUserLocal } from "../graphql/queries";
import { graphql, compose } from "react-apollo";
import Loader from "./Loader";
import BottomNav from "./navs/BottomNav";
// import { subCircles } from "../graphql/subscriptions";

class MobileLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			isOpen: false
		};
	}
	componentWillMount() {
		// console.log(this.props);
		// this.props.getUserLocal.subscribeToMore({
		// 	document: subCircles,
		// 	variables: { id: this.props.getUserLocal.user.id },
		// 	updateQuery: (prev, { subscriptionData }) => {
		// 		console.log(
		// 			subscriptionData,
		// 			subscriptionData.data.Circle.node
		// 		);
		// 	}
		// });
	}
	/*Triggered when swiping between views (mobile only) */
	onChangeIndex = (index, type) => {
		// console.log(index, type);
		if (type === "end") {
			this.setState({
				index: index
			});
		}
	};
	/* Triggered when manually switching views (with button) */
	changeIndex = e => {
		const switcher = {
			calendar: 0,
			addTask: 1
		};
		this.setState({
			index: switcher[e]
		});
	};
	toggleMenu = () => {
		console.log("trigger");
		this.setState({
			isOpen: !this.state.isOpen
		});
	};
	isMenuOpen = state => {
		this.setState({
			isOpen: state.isOpen
		});
	};
	render() {
		const { error, loading, user } = this.props.getUserLocal;
		if (loading) {
			return (
				<div id="desktop-wrapper-outer" className="wrapper">
					<div className="wrapper" id="desktop-wrapper">
						<Loader />
					</div>
				</div>
			);
		}
		if (error) {
			console.log("Error getting user id from state", error);
		}
		if (user.id !== "") {
			const atChatWindow =
				/\/app\/channel\/.+/.test(window.location.pathname) ||
				/\/app\/new\/message/.test(window.location.pathname);
			const activeTab = /\/app\/circle/.test(window.location.pathname)
				? "circles"
				: /\/channel/.test(window.location.pathname)
					? "channels"
					: /\/app\/user/.test(window.location.pathname)
						? "user"
						: "app";
			return (
				<div id="desktop-wrapper-outer" className="wrapper">
					<PushingMenu
						isOpen={this.state.isOpen}
						isMenuOpen={this.isMenuOpen}
						history={this.props.history}
						userId={user.id}
					/>
					<div
						index={this.state.index}
						className="wrapper"
						style={{
							height: "100vh",
							width: "100vw"
						}}
						id="desktop-wrapper"
					>
						<Switch>
							<Route
								exact
								path="/app/circles"
								component={props => (
									<Circles
										{...props}
										toggleMenu={this.toggleMenu}
										userId={user.id}
									/>
								)}
							/>
							<Route
								exact
								path="/app/channels"
								component={props => (
									<Channels {...props} userId={user.id} />
								)}
							/>
							<Route
								path="/app"
								component={props => (
									<Dashboards {...props} userId={user.id} />
								)}
							/>
						</Switch>
						<BottomNav
							toggleMenu={this.toggleMenu}
							show={atChatWindow}
							activeTab={activeTab}
						/>
					</div>
				</div>
			);
		}
	}
}

export default compose(
	// 	graphql(subCircles, {
	// 		name: "subCircles",
	// 		options: ({ id = "" }) => ({
	// 			variables: { id }
	// 		})
	// 	}),
	graphql(getUserLocal, { name: "getUserLocal" })
)(MobileLayout);
