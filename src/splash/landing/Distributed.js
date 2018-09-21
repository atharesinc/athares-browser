import React from "react";
import { Line } from "rc-progress";
import { Link } from "react-router-dom";

class Distributed extends React.PureComponent {
	constructor(props) {
		super();

		this.state = {
			percent: 0
		};
	}
	componentDidMount() {
		window.addEventListener(
			"scroll",

			this.animateProgress,
			true
		);
	}
	componentWillUnmount() {
		window.removeEventListener(
			"scroll",

			this.animateProgress,
			true
		);
	}
	animateProgress = () => {
		if (!this.isInViewport()) {
			return false;
		}
		this.setState({
			percent: 5
		});
		window.removeEventListener("scroll", this.animateProgress, true);
	};
	isInViewport = () => {
		let rect = document
			.getElementById("distributed-meter")
			.getBoundingClientRect();
		let html = document.documentElement;
		return rect.bottom <= html.clientHeight;
	};
	render() {
		return (
			<header
				className="sans-serif grey-screen"
			>
				<div className="mw9 center pa4 pt5-ns ph5-l">
					<h3 className="f1 f1-m lh-title mv0">
						<span className="lh-copy white pa1 tracked-tight">
							As Distributed As Possible
						</span>
					</h3>
					<h4 className="f3 fw1 white">
						Athares clients leverage cutting edge technology
						improvements in WebRTC and P2P libraries with the goal
						of becoming 100% server-free during operation.
					</h4>
					<Line
						id="distributed-meter"
						percent={this.state.percent}
						strokeWidth="1"
						strokeColor="#00DFFC"
					/>{" "}
					<div className="white mb3 mt3">
						<span className="f3 fw1">{this.state.percent}</span>%
						Distributed
					</div>
					<div>
						<div className="f6 link dim br-pill ba bw1 ph3 pv2 mb3 mt3 dib white">
							<Link to="/roadmap">
								Check our progress &raquo;
							</Link>
						</div>
					</div>
				</div>
			</header>
		);
	}
}
export default Distributed;
