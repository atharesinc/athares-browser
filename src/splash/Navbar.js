import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.animateBackground, true);
  }
  animateBackground = () => {
    const h = this.props.scrolled;
    document.getElementById('splash-nav').style.background = h  ? '#FFFFFF' : 'transparent';
  };
  componentWillUnmount() {
    window.removeEventListener('scroll', this.animateBackground, true);
  }
  render() {
    const { scrolled } = this.props;

    const logo =
    scrolled
          ? './img/Athares-logo-small-black.png'
          : './img/Athares-logo-small-white.png',
      brand =
      !scrolled
          ? './img/Athares-full-small-white.png'
          : './img/Athares-full-small-black.png';

    const textStyle = scrolled ? whiteStyle : normalStyle;

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
