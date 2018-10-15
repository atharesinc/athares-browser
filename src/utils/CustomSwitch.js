import React, { PureComponent } from "react";
import { Switch } from "react-router-dom";
import { TweenMax } from "gsap";

export default class CustomSwitch extends PureComponent {
	componentWillEnter (callback) {
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 100, opacity: 0}, {y: 0, opacity: 1, onComplete: callback});
  }

  componentWillLeave (callback) {
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 0, opacity: 1}, {y: -100, opacity: 0, onComplete: callback});
  }
	render(){
		return (
			<Switch location={this.props.location} className={this.props.className}>
			{this.props.children}
			</Switch>
			)
	}
}