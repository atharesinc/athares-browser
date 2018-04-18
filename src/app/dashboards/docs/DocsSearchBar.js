import React, { Component } from "react";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

export default class DocsSearchBar extends Component {
	newAmendment = () => {
		console.log("new amendment");
	};
	render() {
		return (
			<div id="doc-toolbar">
				<Link
					to="/app/circle/:id/add/amendment"
					className="icon-wrapper"
					onClick={this.newAmendment}
				>
					<FeatherIcon icon="plus" />
				</Link>
			</div>
		);
	}
}
