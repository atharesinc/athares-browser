import React, { PureComponent, Fragment } from 'react';
// import Loader from "./Loader";

import TopNav from './mobile/TopNav';
import Circles from './mobile/Circles';
import BottomNav from './mobile/BottomNav';
import Channels from './channels';
import Dashboards from './dashboards';
import PushingMenu from './menu';
import { Switch, Route } from 'react-router-dom';
import { withGun } from 'react-gun';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { updateCircle } from '../store/state/actions';

class MobileLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            isOpen: false,
            user: null
        };
    }
    /*Triggered when swiping between views (mobile only) */
    onChangeIndex = (index, type) => {
        // console.log(index, type);
        if (type === 'end') {
            this.setState({
                index: index
            });
        }
    };
    componentDidMount() {
        if (this.props.user) {
            this.getUser();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.getUser();
        }
    }
    getUser = () => {
        // get this user
        let userRef = this.props.gun.user();

        userRef.get('profile').once(async user => {
            this.setState({
                user
            });
        });
    };
    /* Triggered when manually switching views (with button) */
    changeIndex = e => {
        const switcher = {
            calendar: 0,
            addTask: 1
        };
        this.setState({
            index: switcher[e]
        });
    };
    toggleMenu = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    isMenuOpen = state => {
        this.setState({
            isOpen: state.isOpen
        });
    };
    setActive = id => {
        this.props.dispatch(updateCircle(id));
    };
    render() {
        const { user } = this.state;
        const { circles, activeCircle, activeChannel, location } = this.props;
        return (
            <div id='app-wrapper-outer' className='wrapper'>
                <PushingMenu
                    isOpen={this.state.isOpen}
                    isMenuOpen={this.isMenuOpen}
                    history={this.props.history}
                    user={user}
                    toggleMenu={this.toggleMenu}
                />
                <div
                    index={this.state.index}
                    className='wrapper'
                    style={{
                        height: '100vh',
                        width: '100vw'
                    }}
                    id='app-wrapper'>
                    <TopNav
                        toggleMenu={this.toggleMenu}
                        hide={location.pathname !== '/app'}
                        user={user}
                    />
                    <Switch>
                        <Route
                            exact
                            component={props => (
                                <CirclesAndChannels
                                    activeCircle={activeCircle}
                                    circles={circles}
                                    setActive={this.setActive}
                                    user={user}
                                    {...props}
                                />
                            )}
                            path='/app'
                        />
                        <Route component={props => <Dashboards {...props} />} />
                    </Switch>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        pub: pull(state, 'pub'),
        activeCircle: pull(state, 'activeCircle'),
        circles: pull(state, 'circles'),
        activeChannel: pull(state, 'activeChannel')
    };
}

export default withGun(connect(mapStateToProps)(MobileLayout));

const CirclesAndChannels = props => {
    return (
        <Fragment>
            <Circles
                activeCircle={props.activeCircle}
                circles={props.circles}
                setActive={props.setActive}
                user={props.user}
            />
            <Channels {...props} />
        </Fragment>
    );
};
