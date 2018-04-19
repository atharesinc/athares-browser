import React, { Component } from "react";
import "tachyons";
import "./styles/App.css";
// import "sweetalert/dist/sweetalert.min.css";
import "./styles/swaloverride.css";
import swal from "sweetalert";
import { Switch, Route } from "react-router-dom";
import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Portal from "./portal";
import About from "./splash/about";

import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";
import { TweenMax } from "gsap";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			width: window.innerWidth,
			res: "low-img"
		};
	}
	updateWidth() {
		this.setState({
			width: window.innerWidth
		});
	}
	componentDidUpdate() {
		this.routeFix();
	}
	componentDidMount() {
		window.addEventListener(
			"resize",
			throttle(this.updateWidth.bind(this), 1000)
		);
		this.routeFix();
		let my_image = new Image();
		my_image.src = "/img/iss-master.jpg";
		this.setState({
			res: "high-img"
		});
	}
	routeFix = () => {
		if (/\/login/.test(window.location.pathname)) {
			document
				.getElementById("root")
				.removeEventListener("mousemove", this.parallaxApp, true);
			document
				.getElementById("root")
				.addEventListener("mousemove", this.parallaxLogin, true);
			document.getElementById("root").style.overflow = "hidden";
		} else if (/\/app/.test(window.location.pathname)) {
			document
				.getElementById("root")
				.removeEventListener("mousemove", this.parallaxLogin, true);
			document
				.getElementById("root")
				.addEventListener("mousemove", this.parallaxApp, true);
			document.getElementById("root").style.overflow = "hidden";
		} else {
			document.getElementById("root").style.overflow = "auto";
			document
				.getElementById("root")
				.removeEventListener("mousemove", this.parallaxApp, true);
			document
				.getElementById("root")
				.removeEventListener("mousemove", this.parallaxLogin, true);
		}
	};
	parallaxLogin = e => {
		this.parallaxIt(e, "#portal-wrapper", 30, "#entry-portal");
		this.parallaxIt(e, "#entry-portal", -30, "#entry-portal");
	};
	parallaxApp = e => {
		this.parallaxIt(e, "#desktop-wrapper-outer", 30, "#main-layout");
		this.parallaxIt(e, "#main-layout", -30, "#main-layout");
	};
	componentWillUnmount() {
		window.addEventListener(
			"resize",
			throttle(this.updateWidth.bind(this), 1000)
		);
		document.getElementById("root").addEventListener("mousemove", e => {
			e.stopPropogation();
			e.preventDefault();
		});
	}
	parallaxIt = (e, target, movement, rootElement) => {
		console.log();
		var $this = document.querySelector(rootElement);
		var relX = e.pageX - $this.offsetLeft;
		var relY = e.pageY - $this.offsetTop;

		const height = window.innerHeight * 0.9,
			width = window.innerWidth * 0.9;
		TweenMax.to(target, 1.25, {
			x: (relX - width / 2) / width * movement,
			y: (relY - height / 2) / height * movement
		});
	};
	render() {
		return (
			<Switch>
				<Route exact path="/" component={SplashPage} />
				<Route exact path="/roadmap" component={Roadmap} />
				<Route exact path="/about" component={About} />
				<Route
					exact
					path="/login"
					component={props => (
						<div id="entry-portal" className={`${this.state.res}`}>
							<Portal {...props} />
						</div>
					)}
				/>
				<Route
					path="/app"
					component={props => (
						<div
							className={`wrapper ${this.state.res}`}
							id="main-layout"
						>
							{this.state.width >= 768 ? (
								<DesktopLayout {...props} />
							) : (
								<MobileLayout {...props} />
							)}
						</div>
					)}
				/>
			</Switch>
		);
	}
}

export default App;
