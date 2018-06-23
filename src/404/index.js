import React from "react";
import { Link } from "react-router-dom";

const NoMatch = ({ location }) => (
	<div
		style={{
			backgroundImage: "url(/img/pexels-photo-110854.jpeg)",
			backgroundSize: "cover",
			height: "100vh",
			width: "100vw"
		}}
		className="bg-theme wrapper"
	>
		<header className="tc ph5 lh-copy">
			<h1 className="f1 f-headline-l code mb3 fw9 dib tracked-tight theme-blue">
				404
			</h1>
			<h2 className="tc f1-l fw1 white">
				Sorry, we can't find the page you are looking for.
			</h2>
		</header>
		<p className="fw1 tc mt4 mt5-l f4 f3-l white-80 sans-serif">
			Are you looking for one of these?
		</p>
		<ul className="list tc pl0 w-100 mt5">
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/"
				>
					Home
				</Link>
			</li>
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/login"
				>
					Login
				</Link>
			</li>
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/login"
				>
					Login
				</Link>
			</li>
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/roadmap"
				>
					Roadmap
				</Link>
			</li>
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/about"
				>
					About
				</Link>
			</li>
			<li className="dib">
				<Link
					className="f5 f4-ns link white db pv2 ph3 hover-light-purple"
					style={{ color: "#FFFFFF" }}
					to="/help"
				>
					Help
				</Link>
			</li>
		</ul>
	</div>
);
export default NoMatch;
