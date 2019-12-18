import React from "reactn";
import FeatherIcon from "feather-icons-react";

const Body = props => {
	return (
		<div className="dt-ns dt--fixed-ns sans-serif bg-white">
			<div className="dtc-ns tc pv4">
				<div className="tc">
					<FeatherIcon
						className="br-100 h3 w3 dib ba b--black pa1 b--theme-blue"
						icon="user-check"
						style={{ borderWidth: "0.25rem" }}
					/>
					<h1 className="f3 mb2">Fair & Direct</h1>
					<h2 className="f5 fw4 gray mt0">
						Individuals create and vote on laws without corruptible
						representatives.
						<br />
						Influence is proportional and equal.
					</h2>
				</div>
			</div>
			<div className="dtc-ns tc pv4">
				<div className="tc">
					<FeatherIcon
						className="br-100 h3 w3 dib ba b--black pa1 b--theme-blue"
						icon="zap"
						style={{ borderWidth: "0.25rem" }}
					/>
					<h1 className="f3 mb2">Securely Performant</h1>
					<h2 className="f5 fw4 gray mt0">
						Built on performance-optimized 'nano-blockchains'.
						<br />
						Governance blockchains are private between individuals.
						No syncing the entire blockchain.
					</h2>
				</div>
			</div>
			<div className="dtc-ns tc pv4">
				<div className="tc">
					<FeatherIcon
						className="br-100 h3 w3 dib ba b--black pa1 b--theme-blue"
						icon="message-circle"
						style={{ borderWidth: "0.25rem" }}
					/>
					<h1 className="f3 mb2">News & Chat</h1>
					<h2 className="f5 fw4 gray mt0">
						Curated, crowd-sourced news platform alongside a
						full-featured communication platform.
					</h2>
				</div>
			</div>
		</div>
	);
};

export default Body;
