import React from "react";
import Circle from "./Circle";

const OtherCircles = ({ usersCircles = [] }) => {
	return (
		<div id="other-circles">
			{circles.map(circle => (
				<Circle key={circle.id} {...circle} activeCircle="ssdcsc" />
			))}
		</div>
	);
};

export default OtherCircles;

const circles = [
	{
		id: "ds78g6d97gs",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "sd87fg69s87df",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "s47d6f5g",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "09s8df0h9",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "8sd76f5gs786df",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "9s8df7g98d7f98g",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	},
	{
		id: "987df9g89d8",
		name: "Free People of Mars",
		icon:
			"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
	}
];
