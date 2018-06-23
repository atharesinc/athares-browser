import React from "react";
import { Link } from "react-router-dom";
import { getActiveCircle } from "../../graphql/queries";
import { compose, graphql } from "react-apollo";

/*
    A Group of Governance Channels
    TODO
*/
const GovernanceChannelGroup = props => {
	const { error, loading, activeCircle } = props.getActiveCircle;
	if (error) {
		return null;
	} else if (loading) {
		return null;
	}
	return (
		<div className="channel-group-wrapper">
			<div className={`channel-group-label`} style={{ color: "#FFFFFF" }}>
				{props.name}
			</div>
			<div style={{ width: "100%" }}>
				<Link
					to={`/app/circle/${activeCircle.id}/constitution`}
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					Constitution
				</Link>
				<Link
					to={`/app/circle/${activeCircle.id}/revisions`}
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					Polls
				</Link>
				<Link
					to={`/app/circle/${activeCircle.id}/news`}
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					News
				</Link>
			</div>
		</div>
	);
};

export default compose(graphql(getActiveCircle, { name: "getActiveCircle" }))(
	GovernanceChannelGroup
);
