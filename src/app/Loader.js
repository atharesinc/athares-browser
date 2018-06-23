import React from "react";

const Loader = props => {
	return (
		<div className="loader-wrapper">
			<img
				className="loader-img"
				src="/img/Athares-logo-small-white-no-circle.png"
				alt="Loading"
			/>
			<div className="loader" />
			<div className="loader delay" />
		</div>
	);
};
export default Loader;
