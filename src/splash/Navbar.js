import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Navbar extends Component {
	componentDidMount() {
		window.addEventListener("scroll", this.animateBackground, true);
	}
	animateBackground = () => {
		const h = document.getElementById("root").scrollTop;

		document.getElementById("splash-nav").style.background =
			h > 100 ? "#000000cc" : "transparent";
	};
	componentWillUnmount() {
		window.removeEventListener("scroll", this.animateBackground, true);
	}
	render() {
		return (
			<nav className="dt w-100 center tracked" id="splash-nav">
				<div className="dtc w2 v-mid pa1 ph3">
					<Link
						to="/"
						className="dib w3 h3 pa1 grow-large border-box"
					>
						<img
							src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
							alt="A"
						/>
						<img
							src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-full-small-white.png"
							alt="Athares"
							className="dn-m"
						/>
					</Link>
				</div>
				<div className="dtc v-mid tr pa1 ph3">
					{/*<div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3">
											<Link to="/tech">How it Works</Link>
										</div>*/}
					<div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3">
						<Link to="/roadmap">Roadmap</Link>
					</div>
					<div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3">
						<Link to="/about">About</Link>
					</div>
					<div className="f6 fw4 link hover-white br-pill ba bw1 ph3 pv2 mb2 dib white-70">
						<Link to="/login">Register</Link>
					</div>
				</div>
			</nav>
		);
	}
}
