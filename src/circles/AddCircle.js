import React from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const AddCircle = (props, { addCircle }) => {
	return (
		<Link to="/app/new/circle" id="add-circle-button">
			<FeatherIcon icon="plus" />
		</Link>
	);
};

export default AddCircle;
