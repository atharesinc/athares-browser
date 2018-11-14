import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
    componentDidMount() {
        window.addEventListener('scroll', this.animateBackground, true);
    }
    animateBackground = () => {
        const h = this.props.scrolled;
        document.getElementById('splash-nav').style.background = h
            ? '#FFFFFF'
            : 'transparent';
    };
    componentWillUnmount() {
        window.removeEventListener('scroll', this.animateBackground, true);
    }
    render() {
        const { scrolled } = this.props;

        const logo = scrolled
                ? '/img/Athares-logo-small-black.png'
                : '/img/Athares-logo-small-white.png',
            brand = !scrolled
                ? '/img/Athares-full-small-white.png'
                : '/img/Athares-full-small-black.png';

        const textStyle = scrolled ? whiteStyle : normalStyle;

        return (
            <nav
                className='dt w-100 center tracked'
                id='splash-nav'
                style={textStyle}>
                <div className='dtc w2 v-mid pa1 ph3'>
                    <Link to='/' className='dib w3 h3 pa1 dim border-box'>
                        <img src={logo} alt='A' />
                        <img src={brand} alt='Athares' className='dn db-ns' />
                    </Link>
                </div>
                <div className='dtc v-mid tr pa1 ph3'>
                    <Link to='/roadmap'>
                        <div
                            className='f6 fw4 dim no-underline dn dib-l pv2 ph3'
                            style={textStyle}>
                            Roadmap
                        </div>
                    </Link>
                    <Link to='/about'>
                        <div
                            className='f6 fw4 dim no-underline dn dib-l pv2 ph3'
                            style={textStyle}>
                            About
                        </div>
                    </Link>
                    <Link to='/login'>
                        <div
                            className='f6 fw4 dim br-pill ba bw1 ph3 pv2 mb2 dib'
                            style={textStyle}>
                            Login
                        </div>
                    </Link>
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
    color: '#FFFFFF',
    background: 'transparent'
};
