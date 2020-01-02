import React from "reactn";
import FeatherIcon from "feather-icons-react";
const Circle = ({ id, name, icon, selectCircle, isActive }) => {
	return (
		<div
			className={`circle-img-wrapper ${isActive ? "active-circle" : ""}`}
			data-circle-id={id}
			data-circle-name={name}
			onClick={() => {
				selectCircle(id);
			}}
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
