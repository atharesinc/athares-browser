import React from "react";

const Circle = props => {
	return (
		<div className="circle-img-wrapper">
			<img
				src={
					"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
				}
				className="circle-img pa2"
				alt=""
			/>
		</div>
	);
};

export default Circle;
