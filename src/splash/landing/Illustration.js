import React from "react";

const Illustration = props => {
	return (
		<div>
			<article className="cf">
				<div className="fl w-100 w-50-ns bg-near-white tc pa2">
					<h1 className="f3 mb2 tc">Nano-Sized</h1>
					<h2 className="f5 fw4 gray mt0">
						Your data footprint stays small with privatized
						'nano-blockchains' where users only need to sync data
						relevant to them. Building a better blockchain.
					</h2>
				</div>
				<div className="fl w-100 w-50-ns tc pa2">
					<h1 className="f3 mb2 tc white">Direct</h1>
					<h2 className="f5 fw4 white-70 mt0">
						Individuals participate directly in debate and vote on
						the laws that affect them without middlemen
						representatives. Representation is equal and fair.
					</h2>
				</div>
			</article>
			<article className="cf">
				<div className="fl w-100 w-50-ns tc pa2">
					<h1 className="f3 mb2 tc white">Distributed</h1>
					<h2 className="f5 fw4 white-70 mt0">
						Individuals own their data, not companies. Users can
						operate securely because data is inherently immune to
						corruption or tampering.
					</h2>
				</div>
				<div className="fl w-100 w-50-ns bg-near-white tc pa2">
					<h1 className="f3 mb2 tc">Transparent & Encrypted</h1>
					<h2 className="f5 fw4 gray mt0">
						Personal information stays private, public knowledge is
						easily accessible. Direct messaging is secured with
						end-to-end encryption, and all public matters are
						broadcast to all members of each Circle. You never miss
						a beat, and advertisers never see your data.
					</h2>
				</div>
			</article>
		</div>
	);
};

export default Illustration;
