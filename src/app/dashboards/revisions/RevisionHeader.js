import React from "react";

const RevisionHeader = ({ title, isNew }) => {
	return (
		<div className="ma3">
			<small className="f6 white-70 db mb2 ml3">
				{isNew
					? "Review the proposed draft"
					: "Review changes to this amendment"}
			</small>
		</div>
	);
};

export default RevisionHeader;
