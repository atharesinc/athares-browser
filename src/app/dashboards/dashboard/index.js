import React, { Component } from "react";
// import DashboardLink from "./DashboardLink";
import { Link } from "react-router-dom";
import SelectCornersDiv from "../../../utils/SelectCornersDiv";

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
				<div
					className="contain bg-center h4 pa2 mb2"
					style={{
						backgroundImage:
							"url(/img/Athares-full-large-white.png)"
					}}
				/>
				<div className="f7 ttu tracked white-80 mb3">
					Distributed Democracy Platform
				</div>
				<div className="mw9 center">
					<div className="cf mb3">
						<Link
							className="fl w-100 w-50-ns pv2"
							to={"/app/new/circle"}
						>
							<SelectCornersDiv>
								<div className="bg-white-10 tc dashboard-item">
									<div className="dashboard-title white">
										Create New Circle
									</div>
								</div>
							</SelectCornersDiv>
						</Link>
						<Link
							className="fl w-100 w-50-ns pv2"
							to={"/app/new/message"}
						>
							<SelectCornersDiv>
								<div className="bg-white-20 tc dashboard-item">
									<div className="dashboard-title white">
										Message User
									</div>
								</div>
							</SelectCornersDiv>
						</Link>
					</div>
					<div className="bg-white-20 mt2 pv3 w-100 ph4 ttu tracked">
						Athares News
					</div>
					<div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
						No News Available
					</div>
				</div>
			</div>
		);
	}
}

// const links = [
// 	{
// 		link: "/app/new/circle",
// 		icon: "plus-circle",
// 		title: "Create New Circle"
// 	},
// 	// {
// 	// 	link: "/app/circle/:id/new/channel",
// 	// 	icon: "hash",
// 	// 	title: "Create New Channel"
// 	// },
// 	// {
// 	// 	link: "/app/circle/:id/add/user",
// 	// 	icon: "user-plus",
// 	// 	title: "Invite User"
// 	// },
// 	{ link: "/app/new/message", icon: "message-circle", title: "Message User" }
// 	// {
// 	// 	link: "/app/circle/:id/add/amendment",
// 	// 	icon: "file-plus",
// 	// 	title: "Add Amendment"
// 	// },
// 	// {
// 	// 	link: "/app/circle/:id/revisions",
// 	// 	icon: "git-pull-request",
// 	// 	title: "View revisions"
// 	// }
// ];
