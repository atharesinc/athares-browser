import React from "reactn";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

const DocsSearchBar = ({ id }) => {
	return (
		<div id="doc-toolbar">
			<Link to="/app">
	            <FeatherIcon
	                icon="chevron-left"
	                className="white db dn-ns"
	            />
            </Link>
			<Link
				to={`/app/circle/${id}/add/amendment`}
				className="icon-wrapper"
			>
				<FeatherIcon icon="plus" />
			</Link>
		</div>
	);
};
export default DocsSearchBar;
