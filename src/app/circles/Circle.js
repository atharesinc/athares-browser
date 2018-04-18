import React from "react";
import FeatherIcon from "feather-icons-react";

const Circle = ({ id, name, icon, selectCircle, activeCircle = "" }) => {
	return (
		<div
			className={`circle-img-wrapper ${
				activeCircle === id ? "active-circle" : ""
			}`}
			data-circle-id={id}
			data-circle-name={name}
			onClick={selectCircle}
		>
			<img src={icon} className="circle-img" alt="" />
			<div className="circle-name white">
				{name}
				<FeatherIcon
					icon="circle"
					id="circle-options"
					className={true && "dn"}
				/>
			</div>
		</div>
	);
};

export default Circle;
