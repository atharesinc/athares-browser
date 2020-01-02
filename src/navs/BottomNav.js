import React from "reactn";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";

const BottomNav = ({ show, activeTab, toggleMenu }) => {
	return (
		<div id="bottom-nav" style={{ display: show ? "none" : "flex" }}>
			<Link className="bottom-nav-wrapper" to={"/app/circles"}>
				<FeatherIcon
					icon="globe"
					className={activeTab === "circles" ? "black" : "black-60"}
				/>
			</Link>
			<Link className="bottom-nav-wrapper" to={"/app/channels"}>
				<FeatherIcon
					icon="hash"
					className={activeTab === "channels" ? "black" : "black-60"}
				/>
			</Link>
			<Link className="bottom-nav-wrapper" to={"/app"}>
				<FeatherIcon
					icon="grid"
					className={activeTab === "app" ? "black" : "black-60"}
				/>
			</Link>
			<div className="bottom-nav-wrapper" onClick={toggleMenu}>
				<FeatherIcon
					icon="user"
					className={activeTab === "user" ? "black" : "black-60"}
				/>
			</div>
		</div>
	);
};

export default BottomNav;
