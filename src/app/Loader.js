import React from "react";

const Loader = props => {
	return (
		<div className="loader-wrapper">
			<img
				className="loader-img"
				src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white-no-circle.png"
				alt="Loading"
			/>
			<div className="loader" />
			<div className="loader delay" />
		</div>
	);
};
export default Loader;
