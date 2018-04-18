import React, { Component } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";
import { Switch, Route } from "react-router-dom";

// import SwipeableViews from "react-swipeable-views";
import BottomNav from "./navs/BottomNav";

export default class EntryPortal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			isOpen: false
		};
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
		const atChatWindow =
			/\/app\/channel\/.+/.test(window.location.pathname) ||
			/\/app\/new\/message/.test(window.location.pathname);
		console.log(window.location.pathname, atChatWindow);
		const activeTab = /\/app\/circle/.test(window.location.pathname)
			? "circles"
			: /\/channel/.test(window.location.pathname)
				? "channels"
				: /\/app\/user/.test(window.location.pathname) ? "user" : "app";

		return (
			<div id="desktop-wrapper-outer" className="wrapper">
				<PushingMenu
					isOpen={this.state.isOpen}
					isMenuOpen={this.isMenuOpen}
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
								/>
							)}
						/>
						<Route
							exact
							path="/app/channels"
							component={props => <Channels {...props} />}
						/>
						<Route
							path="/app"
							component={props => <Dashboards {...props} />}
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
