import React, { Component } from "react";
import DashboardLink from "./DashboardLink";

export default class Dashboard extends Component {
	render() {
		return (
			<div
				id="dashboard-wrapper"
				className="horizontal pa3"
				style={{
					display: "block"
				}}
			>
				<div className="mw9 center ph3-ns">
					<div className="cf ph2-ns">
						{links.map((item, i) => (
							<DashboardLink key={i} {...item} />
						))}
					</div>
				</div>
			</div>
		);
	}
}

const links = [
	{
		link: "/app/new/circle",
		icon: "plus-circle",
		title: "Create New Circle"
	},
	{
		link: "/app/circle/:id/new/channel",
		icon: "hash",
		title: "Create New Channel"
	},
	{
		link: "/app/circle/:id/add/user",
		icon: "user-plus",
		title: "Invite User"
	},
	{ link: "/app/new/message", icon: "message-circle", title: "Message User" },
	{
		link: "/app/circle/:id/add/amendment",
		icon: "file-plus",
		title: "Add Amendment"
	},
	{
		link: "/app/circle/:id/revisions",
		icon: "git-pull-request",
		title: "View revisions"
	}
];
