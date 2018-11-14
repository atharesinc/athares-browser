import React from 'react';

const Footer = props => {
    return (
        <footer className='pa4 pv2-ns ph4 black-70 bt b--black-10 sans-serif bg-white'>
            {/* <section className='cf mb5'>
                <div className='mb4 mb0-ns w-100 w-50-l fr'>
                    <h3 className='f3 f1-m lh-title mv0'>
                        <span className='lh-copy black-80 pa1 tracked-tight'>
                            Send us a message:
                        </span>
                    </h3>
                    <a
                        className='black-70 f3 f2-ns fw6 tl link dim dib pv3 mt2 mb4 mb0-l'
                        href='mailto:hello@impossible.com'>
                        hello@athares.com
                    </a>
                </div>
                <div className='mb4 mb0-ns fl w-100 w-50-l'>
                    <h3 className='f3 f1-m lh-title mt0 mb3'>
                        <span className='lh-copy black-80 pa1 tracked-tight'>
                            Sign up for our newsletter
                        </span>
                    </h3>
                    <input
                        placeholder='Email Address'
                        className='mw-100 w-100 w5-ns f5 input-reset ba b--black-20 pv3 ph4 border-box'
                    />
                    <input
                        type='submit'
                        className='input-reset w-100 w-auto-ns bg-black-80 white f5 pv2 pv3-ns ph4 ba b--black-80 bg-hover-mid-gray'
                    />
                </div>
            </section> */}
            <div className='dt dt--fixed w-100'>
                <div className='dn dtc-ns v-mid'>
                    <p className='f7 black-70 dib pr3 mb3'>
                        Copyright © Athares {new Date().getFullYear()}
                    </p>
                </div>
                <div className='db dtc-ns black-70 tc tr-ns v-mid'>
                    <a
                        href='https://twitter.com/atharesinc'
                        className='link dim dib mr3 black-70'>
                        <svg
                            className='db w2 h2'
                            data-icon='twitter'
                            viewBox='0 0 32 32'
                            fill='currentColor'>
                            <title>twitter icon</title>
                            <path d='M2 4 C6 8 10 12 15 11 A6 6 0 0 1 22 4 A6 6 0 0 1 26 6 A8 8 0 0 0 31 4 A8 8 0 0 1 28 8 A8 8 0 0 0 32 7 A8 8 0 0 1 28 11 A18 18 0 0 1 10 30 A18 18 0 0 1 0 27 A12 12 0 0 0 8 24 A8 8 0 0 1 3 20 A8 8 0 0 0 6 19.5 A8 8 0 0 1 0 12 A8 8 0 0 0 3 13 A8 8 0 0 1 2 4' />
                        </svg>
                    </a>
                    <a
                        href='https://medium.com/'
                        className='link dim dib mr3 black-70'
                        title='Impossible Labs on Medium'>
                        <svg
                            className='db w2 h2'
                            x='0px'
                            y='0px'
                            viewBox='0 0 290 248.6'
                            fill='currentColor'>
                            <g>
                                <path
                                    fill='currentColor'
                                    className='st0'
                                    d='M287.8,46.3L196,0.3c-0.4-0.2-0.9-0.3-1.3-0.3c0,0-0.1,0-0.1,0c-1.1,0-2.2,0.6-2.8,1.5l-56.6,92l63.2,102.7 l90.4-146.9C289.4,48.3,289,46.8,287.8,46.3z'
                                />
                                <polygon
                                    fill='currentColor'
                                    points='105.2,61.2 105.2,160.3 193.3,204.4 	'
                                />
                                <path
                                    fill='currentColor'
                                    d='M201,208.2l80.9,40.5c4.4,2.2,8,0,8-5v-180L201,208.2z'
                                />
                                <path
                                    fill='currentColor'
                                    d='M95.5,46.7L10.7,4.3L5.4,1.7C4.6,1.3,3.8,1.1,3.2,1.1c-0.9,0-1.7,0.4-2.3,1.1C0.3,2.8,0,3.8,0,5v193.4 c0,3.3,2.4,7.2,5.4,8.7l83.3,41.6c1.2,0.6,2.3,0.9,3.3,0.9c2.8,0,4.8-2.2,4.8-5.8V48.7C96.7,47.8,96.2,47.1,95.5,46.7z'
                                />
                            </g>
                        </svg>
                    </a>
                    <a
                        href='https://www.linkedin.com/company/athares/'
                        className='link dim dib black-70'>
                        <svg
                            className='db w2 h2'
                            x='0px'
                            y='0px'
                            viewBox='0 0 48 48'>
                            <linearGradient
                                gradientUnits='userSpaceOnUse'
                                x1='23.9995'
                                y1='0'
                                x2='23.9995'
                                y2='48.0005'>
                                <stop offset='0' />
                                <stop offset='1' />
                            </linearGradient>
                            <path
                                fill='currentColor'
                                d='M48,42c0,3.313-2.687,6-6,6H6c-3.313,0-6-2.687-6-6V6 c0-3.313,2.687-6,6-6h36c3.313,0,6,2.687,6,6V42z'
                            />
                            <g>
                                <g>
                                    <path
                                        fill='#FFFFFF'
                                        d='M15.731,11.633c-1.608,0-2.658,1.083-2.625,2.527c-0.033,1.378,1.018,2.494,2.593,2.494 c1.641,0,2.691-1.116,2.691-2.494C18.357,12.716,17.339,11.633,15.731,11.633z M13.237,35.557h4.988V18.508h-4.988V35.557z M31.712,18.748c-1.595,0-3.222-0.329-4.956,2.36h-0.099l-0.087-2.599h-4.417c0.065,1.411,0.074,3.518,0.074,5.52v11.529h4.988 v-9.854c0-0.46,0.065-0.919,0.196-1.248c0.328-0.919,1.149-1.871,2.527-1.871c1.805,0,2.527,1.411,2.527,3.479v9.494h4.988V25.439 C37.455,20.713,34.993,18.748,31.712,18.748z'
                                    />
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
            </div>
            <div className='db dn-ns'>
                <p className='f7 black-70 mt4 tc'>
                    Copyright © Athares {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
};

export default Footer;
