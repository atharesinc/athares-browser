import React from "react";

const RevisionHeader = ({ title, isNew }) => {
	return (
		<div className="ma3">
			<h1 className="lh-title white">{title}</h1>
			<small className="f6 white-70 db mb2 ml3-ns">
				{isNew
					? "Review the proposed draft"
					: "Review changes to this law"}
			</small>
		</div>
	);
};

export default RevisionHeader;
