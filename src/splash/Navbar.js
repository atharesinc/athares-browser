import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.animateBackground, true);
  }
  animateBackground = () => {
    const h = this.props.top;
    document.getElementById('splash-nav').style.background = h > 100 ? '#FFFFFF' : 'transparent';
  };
  componentWillUnmount() {
    window.removeEventListener('scroll', this.animateBackground, true);
  }
  render() {
    const { top } = this.props;

    const logo =
        top > 100
          ? 'https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-black.png'
          : 'https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png',
      brand =
        top <= 100
          ? 'https://s3.us-east-2.amazonaws.com/athares-images/Athares-full-small-white.png'
          : 'https://s3.us-east-2.amazonaws.com/athares-images/Athares-full-small-black.png';

    const textStyle = top > 100 ? whiteStyle : normalStyle;

    return (
      <nav className="dt w-100 center tracked" id="splash-nav" style={textStyle}>
        <div className="dtc w2 v-mid pa1 ph3">
          <Link to="/" className="dib w3 h3 pa1 grow-large border-box">
            <img src={logo} alt="A" />
            <img src={brand} alt="Athares" className="dn-m" />
          </Link>
        </div>
        <div className="dtc v-mid tr pa1 ph3">
          {/*<div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3">
											<Link to="/tech">How it Works</Link>
										</div>*/}
          <div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3" style={textStyle}>
            <Link to="/roadmap">Roadmap</Link>
          </div>
          <div className="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3" style={textStyle}>
            <Link to="/about">About</Link>
          </div>
          <div className="f6 fw4 link hover-white br-pill ba bw1 ph3 pv2 mb2 dib white-70" style={textStyle}>
            <Link to="/login">Register</Link>
          </div>
        </div>
      </nav>
    );
  }
}

const whiteStyle = {
  color: 'black'
  //   background: '#FFFFFF'
};
const normalStyle = {
  color: '#FFFFFF70',
  background: 'transparent'
};
