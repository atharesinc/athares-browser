import React, { Component } from "react";
import MenuButton from "./MenuButton";

import OtherCircles from "./OtherCircles";
import AddCircle from "./AddCircle";

export default class Circles extends Component {
	render() {
		return (
			<div id="circles-wrapper">
				<div id="current-circle" onClick={this.props.toggleMenu}>
					<MenuButton />
				</div>
				<OtherCircles />
				<AddCircle />
			</div>
		);
	}
}
