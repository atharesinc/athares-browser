import React from 'react';

import FeatherIcon from 'feather-icons-react';

// https://codesandbox.io/s/q3mqkny5o9
const TopNav = props => {
    console.log(props);
    return (
        <div
            className={`mobile-top-nav w-100 v-mid bg-theme-dark flex-row justify-between items-center pv2 ph3 ${
                props.hide ? 'dn' : 'flex'
            }`}>
            <img
                src={props.user ? props.user.icon : '/img/user-default.png'}
                className='ba b--white br-100 w2 h2 bw1'
                alt='Menu'
                onClick={props.toggleMenu}
            />

            <FeatherIcon
                icon='search'
                className='white w2 h2'
                style={{ height: '1.5em', width: '1.5em' }}
            />
        </div>
    );
};

export default TopNav;
