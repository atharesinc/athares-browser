import React from "react";
import { particlesConfig } from "../../utils";
import Particles from "react-particles-js";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

const Nav = props => {
	return (
		<div>
			<Particles
				params={particlesConfig}
				canvasClassName="particle"
				className="particle"
			/>
			<header id="splash-hero" className="sans-serif">
				<div
					className="cover bg-left bg-center-l"
					style={{
						backgroundImage: "url(/img/pexels-photo-110854.jpeg)"
					}}
				>
					<div className="grey-screen pb5 pb6-m pb6-l">
						<Navbar {...props} top={props.top}/>
						<div className="tc-l pt6 ph3">
							<h1 className="f1 f1-m lh-title mv0">
								<span className="lh-copy white pa1 tracked-tight">
									Manage Your Democracy
								</span>
							</h1>
							<h3 className="fw1 f5 theme-blue mt3 mb4">
								Legislation and communication built on
								nano-blockchains
							</h3>
							<h2 className="fw1 f3 white-80 mt3 mb4">
								Athares lets you create and maintain
								organizations with equality.
							</h2>
							<div className="f6 link dim br-pill ba ph3 bw1 pv2 mb2 dib bg-black-40 b--theme-blue theme-blue">
								<Link to="/about">Learn More</Link>
							</div>
							<span className="dib ph3 white-70 mb3">or</span>
							<div className="f6 link dim br-pill ba bw1 ph3 pv2 mb2 dib white">
								<Link to="/login">Get Started</Link>
							</div>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
};

export default Nav;
