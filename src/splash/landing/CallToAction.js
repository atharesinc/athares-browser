import React from "reactn";
import { Link } from "react-router-dom";

const CallToAction = props => {
	return (
		<div>
			<header id="splash-hero" className=" grey-screen">
				<div
					className="cover bg-left bg-center-l"
				>
					<div className="pb5 pb6-m pb6-l">
						<div className="tc-l pt6 ph3">
							<h1 className="f2 f1-m lh-title mv3">
								<span className="lh-copy white pa1 tracked-tight">
									Build the best government in the galaxy.
								</span>
							</h1>

							<div className="f6 link dim br-pill ba ph3 bw1 pv2 mb2 dib bg-black-40 b--white white">
								<Link to="/login">Login or Register</Link>
							</div>
						</div>
					</div>
				</div>
			</header>
		</div>
	);
};

export default CallToAction;
