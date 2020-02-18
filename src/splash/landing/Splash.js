import React from 'react';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

const Splash = props => {
  return (
    <div className='h-100'>
      <Navbar {...props} top={props.top} />
      <div className='h-100 ph3 mt6 mt0-ns mh2 mh4-ns flex flex-column flex-row-ns justify-around items-center'>
        <div>
          <h1 className='f2 f1-ns f1-m lh-title mv0'>
            <span className='lh-copy white pa1 tracked-tight'>
              Good Government is Democratic
            </span>
          </h1>
          <h2 className='fw1 f5 theme-blue mt3 mb4'>
            Athares helps you build good democracies. Participate in
            organizations directly, secured with distributed technology.
          </h2>
          <div className='tc tl-ns ph0'>
            <div className='f6 link dim br-pill ba ph3 bw1 pv2 mb2 dib bg-black-40 b--theme-blue theme-blue'>
              <Link to='/about'>Learn More</Link>
            </div>
            <span className='dib ph3 white-70 mb3'>or</span>
            <div className='f6 link dim br-pill ba bw1 ph3 pv2 mb2 dib white'>
              <Link to='/auth'>Get Started</Link>
            </div>
          </div>
        </div>
        <img alt='' className='w-100 w-60-ns' src='/img/mockup.png' />
      </div>
    </div>
  );
};

export default Splash;
