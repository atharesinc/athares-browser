import React from 'react';

// https://codesandbox.io/s/q3mqkny5o9
import FeatherIcon from 'feather-icons-react';

const TopNav = ({ searchOpen = false, ...props }) => {
    return (
        <div
            className={`mobile-top-nav w-100 v-mid bg-theme-dark flex-row justify-between items-center pv2 ph3 ${
                props.hide ? 'dn' : 'flex'
            }`}>
            <FeatherIcon
                icon='user'
                className='white w2 h2'
                style={{ height: '1.5em', width: '1.5em' }}
            />

            {searchOpen ? (
                <FeatherIcon
                    icon='x'
                    className='white w2 h2'
                    style={{ height: '1.5em', width: '1.5em' }}
                    onClick={props.toggleOpenSearch}
                />
            ) : (
                <FeatherIcon
                    icon='search'
                    className='white w2 h2'
                    style={{ height: '1.5em', width: '1.5em' }}
                    onClick={props.toggleOpenSearch}
                />
            )}
        </div>
    );
};

export default TopNav;
