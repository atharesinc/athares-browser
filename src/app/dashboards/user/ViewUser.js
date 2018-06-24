import React from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import moment from "moment";
import { getUserRemote } from "../../../graphql/queries";
import { compose, graphql } from "react-apollo";
import Loader from "../../Loader";

const ViewUser = props => {
	const { loading, error, User } = props.getUserRemote;
	if (loading) {
		return (<div id="dashboard-wrapper" style={{ overflowY: "scroll" }}>
			<Loader />
		</div>)
	}
	if (error) {
		return (<div id="dashboard-wrapper" style={{ overflowY: "scroll" }}>
			Error connecting to network
		</div>)
	}
	return (
		<div id="dashboard-wrapper" style={{ overflowY: "scroll" }}>
			<div className="particles-bg w-100 vignette shaded">
				<header className="tc pv2 pv4-ns" style={{ height: "12em" }}>
					<div
						className="w-100 row-center"
						style={{ justifyContent: "space-between" }}
					>
						<Link
							className="f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white"
							to="/app"
						>
							BACK
						</Link>
						<Link
							className="f6 link dim br-pill ba bw1 ph3 pv2 mh2 mh4-ns dib white"
							to="/app/user/edit"
						>
							EDIT
						</Link>
					</div>
					<h1 className="f4 f3-ns fw6 white">
						{User.firstName + " " + User.lastName}
					</h1>
					<div
						className="br-100 pa1 br-pill ba bw2 w4 h4 center"
						style={{
							background: `url(${User.icon}) center no-repeat`,
							backgroundSize: "cover"
						}}
					/>
				</header>
				<a
					target="__blank"
					href="https://www.flickr.com/photos/becca02/6727193557"
				>
					<FeatherIcon
						icon="info"
						className="h2 w2 white-30 hover-white ma1 pa1"
					/>
				</a>
			</div>
			{/* user info */}
			<ul className="list ph2 ph4-ns pv2 ma2 w-100 center">
				<h1>Info</h1>
				<li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
					<FeatherIcon
						className="w2 h2 w2-ns h2-ns pa1"
						icon="phone"
					/>
					<div className="pl3 flex-auto">
						<span className="f6 db white-70">Phone</span>
					</div>
					<div>
						<div className="f6 link white-70">
							{User.phone || "Not set"}
						</div>
					</div>
				</li>
				<li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
					<FeatherIcon
						className="w2 h2 w2-ns h2-ns pa1"
						icon="at-sign"
					/>
					<div className="pl3 flex-auto">
						<span className="f6 db white-70">Email</span>
					</div>
					<div>
						<div className="f6 link white-70">
							{User.email || "Not set"}
						</div>
					</div>
				</li>
				<li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
					<FeatherIcon
						className="w2 h2 w2-ns h2-ns pa1"
						icon="link"
					/>
					<div className="pl3 flex-auto">
						<span className="f6 db white-70">Unique Name</span>
					</div>
					<div>
						<div className="f6 link white-70">
							{User.uname || "Not set"}
						</div>
					</div>
				</li>
			</ul>
			{/* Fat Stats */}
			<article className="ph2 ph4-ns pv2" data-name="slab-stat">
				<h1>Statistics</h1>
				<dl className="dib mr5">
					<dd className="f6 f5-ns b ml0 white-70">Circles</dd>
					<dd className="f4 f3-ns b ml0">10</dd>
				</dl>
				<dl className="dib mr5">
					<dd className="f6 f5-ns b ml0 white-70">
						Revisions Proposed
					</dd>
					<dd className="f4 f3-ns b ml0">993</dd>
				</dl>
				<dl className="dib mr5">
					<dd className="f6 f5-ns b ml0 white-70">
						Revisions Accepted
					</dd>
					<dd className="f4 f3-ns b ml0">15</dd>
				</dl>
				<dl className="dib mr5">
					<dd className="f6 f5-ns b ml0 white-70">Times Voted</dd>
					<dd className="f4 f3-ns b ml0">4</dd>
				</dl>
				<dl className="dib mr5">
					<dd className="f6 f5-ns b ml0 white-70">User Since</dd>
					<dd className="f4 f3-ns b ml0">
						{moment(User.createdAt).format("M/D/YY")}
					</dd>
				</dl>
			</article>
		</div>
	);
};

export default compose(
	graphql(getUserRemote, {
		name: "getUserRemote",
		options: ({ user: { id } }) => ({ variables: { id } })
	})
)(ViewUser);
