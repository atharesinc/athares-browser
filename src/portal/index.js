import React, { Fragment } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import Login from './Login';
import Register from './Register';
import NoMatch from '../404';

const Portal = props => {
    if (props.location.pathname === '/portal') {
        props.history.replace('/login');
    }
    return (
        <Fragment>
            <div id='portal-header'>
                <img
                    src='/img/Athares-logo-small-white.png'
                    id='portal-logo'
                    alt='logo'
                />
                <img
                    src='/img/Athares-full-small-white.png'
                    id='portal-brand'
                    alt='brand'
                />
            </div>
            <AnimatedSwitch
                atEnter={{ opacity: 0 }}
                atLeave={{ opacity: 0 }}
                atActive={{ opacity: 1 }}
                style={{ width: '50%' }}>
                <Route
                    exact
                    path={`${props.match.path}/login`}
                    render={props => (
                        <Login {...props} listen={props.allListeners} />
                    )}
                />
                <Route
                    exact
                    path={`${props.match.path}/register`}
                    render={props => (
                        <Register {...props} listen={props.allListeners} />
                    )}
                />
            </AnimatedSwitch>
        </Fragment>
    );
};

export default withRouter(Portal);
