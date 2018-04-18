import React from "react";
import Channel from "./Channel";
import GovernanceChannelLabel from "./ChannelLabel";
import { Link } from "react-router-dom";

/*
    A Group of Governance Channels
    TODO
*/
const GovernanceChannelGroup = props => {
	return (
		<div className="channel-group-wrapper">
			<div className={`channel-group-label`} style={{ color: "#FFFFFF" }}>
				{props.name}
			</div>
			<div style={{ width: "100%" }}>
				<Link
					to="/app/circle/:id/constitution"
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					Constitution
				</Link>
				<Link
					to="/app/circle/:id/revisions"
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					Polls
				</Link>
				<Link
					to="/app/circle/:id/news"
					className={`channel-group-label gov`}
					style={{ borderBottom: "none", textIndent: "1em" }}
				>
					News
				</Link>
			</div>
		</div>
	);
};

export default GovernanceChannelGroup;
