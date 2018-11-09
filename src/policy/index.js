import React from 'react';
import { Link } from 'react-router-dom';

const Policy = ({ location }) => (
    <div
        style={{
            height: '100vh',
            width: '100vw'
        }}
        className='wrapper'>
        <div
            style={{
                color: '#FFFFFF',
                background: 'transparent',
                height: '100vh',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
            <a
                target='_blank'
                href='https://app.termly.io/document/privacy-policy/a5978d1c-8a56-4910-b0b5-32b1ff526936'>
                <div className='white-80 dim pv2 ph4'>Privacy Policy</div>
            </a>
            <a target='_blank' href='https://github.com/atharesinc'>
                <div className='white-80 dim pv2 ph4'>Athares Source Code</div>
            </a>

            <ul className='list tc pl0 w-100 mt5'>
                <li className='dib'>
                    <Link to='/'>
                        <span className='f5 f4-ns link white db pv2 ph3 transparent-hover-text'>
                            Home
                        </span>
                    </Link>
                </li>
                <li className='dib'>
                    <Link to='/login'>
                        <span className='f5 f4-ns link white db pv2 ph3 transparent-hover-text'>
                            Login
                        </span>
                    </Link>
                </li>
                <li className='dib'>
                    <Link to='/roadmap'>
                        <span className='f5 f4-ns link white db pv2 ph3 transparent-hover-text'>
                            Roadmap
                        </span>
                    </Link>
                </li>
                <li className='dib'>
                    <Link to='/about'>
                        <span className='f5 f4-ns link white db pv2 ph3 transparent-hover-text'>
                            About
                        </span>
                    </Link>
                </li>
                <li className='dib'>
                    <Link to='/help'>
                        <span className='f5 f4-ns link white db pv2 ph3 transparent-hover-text'>
                            Help
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
);
export default Policy;
