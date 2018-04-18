import React from "react";

const SelectCornersDiv = ({ children, className = "", styles = {} }) => {
	return (
		<div id="bordered" className={`${className}`} style={styles}>
			<div className="top-borders">
				<div className="corner-tl" />
				<div className="corner-tr" />
			</div>
			<div className="bordered-body">{children}</div>
			<div className="bottom-borders">
				<div className="corner-bl" />
				<div className="corner-br" />
			</div>
		</div>
	);
};

export default SelectCornersDiv;
