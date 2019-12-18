import React, { useState  } from "reactn";
import { Switch } from "react-router-dom";
import { TweenMax } from "gsap";

export default function CustomSwitch (){
	componentWillEnter (callback) {
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 100, opacity: 0}, {y: 0, opacity: 1, onComplete: callback});
  }

  componentWillLeave (callback) {
    const el = this.container;
    TweenMax.fromTo(el, 0.3, {y: 0, opacity: 1}, {y: -100, opacity: 0, onComplete: callback});
  }
	
		return (
			<Switch location={props.location} className={props.className}>
			{props.children}
			</Switch>
			)
	}
}