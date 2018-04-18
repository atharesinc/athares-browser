import React, { PureComponent } from "react";
import Circles from "./circles";
import Channels from "./channels";
import Dashboards from "./dashboards";
import PushingMenu from "./menu";

export default class DesktopLayout extends PureComponent {
	state = {
		isOpen: false
	};
	toggleMenu = () => {
		console.log("trigger");
		this.setState({
			isOpen: !this.state.isOpen
		});
	};
	isMenuOpen = state => {
		this.setState({
			isOpen: state.isOpen
		});
	};
	render() {
		return (
			<div id="desktop-wrapper-outer" className="wrapper">
				<PushingMenu
					isOpen={this.state.isOpen}
					isMenuOpen={this.isMenuOpen}
				/>
				<div
					className="wrapper"
					id="desktop-wrapper"
					style={{
						marginLeft: this.state.isOpen ? "calc(30% - 300px)" : ""
					}}
				>
					<Circles {...this.props} toggleMenu={this.toggleMenu} />
					<Channels {...this.props} />
					<Dashboards {...this.props} />
				</div>
			</div>
		);
	}
}
