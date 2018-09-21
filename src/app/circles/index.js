import React from "react";
import MenuButton from "./MenuButton";

import OtherCircles from "./OtherCircles";
import AddCircle from "./AddCircle";

const Circles = props => {
	return (
		<div id="circles-wrapper">
			<div id="current-circle" onClick={props.toggleMenu}>
				<MenuButton />
			</div>
			<OtherCircles />
			<AddCircle />
		</div>
	);
};

export default Circles;
