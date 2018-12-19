import React, { PureComponent, Fragment } from 'react';
// import Loader from "./Loader";

import TopNav from './mobile/TopNav';
import Circles from './mobile/Circles';
import BottomNav from './mobile/BottomNav';
import Channels from './channels';
import Dashboards from './dashboards';
import PushingMenu from './menu';
import Search from './search';
import { Switch, Route, withRouter } from 'react-router-dom';
import { withGun } from 'react-gun';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { pull as pullUI } from '../store/ui/reducers';
import { closeSearch, toggleSearch } from '../store/ui/actions';
import { updateDesc, updateTitle } from '../store/head/actions';
import {
    updateCircle,
    updateChannel,
    updateRevision
} from '../store/state/actions';

class MobileLayout extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            menuIsOpen: false,
            user: null
        };
    }
    componentDidMount() {
        if (this.props.user) {
            this.getUser();
        }
        if (/app\/circle\/(CI[a-zA-Z\d]+)/.test(this.props.location.pathname)) {
            this.getCircle();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            this.getUser();
        }
        if (
            /app\/circle\/(CI[a-zA-Z\d]+)/.test(this.props.location.pathname) &&
            /app\/circle\/(CI[a-zA-Z\d]+)/.exec(
                this.props.location.pathname
            )[1] !== prevProps.activeCircle
        ) {
            this.getCircle(
                /app\/circle\/(CI[a-zA-Z\d]+)/.exec(
                    this.props.location.pathname
                )[1]
            );
        }
    }
    getCircle = circleID => {
        this.props.gun.get(circleID).once(circle => {
            this.props.dispatch(updateCircle(circleID));
            this.props.dispatch(updateChannel(null));
            this.props.dispatch(updateRevision(null));
            // update meta data
            this.props.dispatch(updateDesc(circle.preamble));
            this.props.dispatch(updateTitle(circle.name));
        });
    };
    clickOffSearch = e => {
        if (e.target.className === 'modal-mask') {
            this.props.dispatch(closeSearch());
        }
    };
    toggleOpenSearch = () => {
        this.props.dispatch(toggleSearch());
    };
    getUser = () => {
        // get this user
        let userRef = this.props.gun.user();

        userRef.get('profile').once(async user => {
            this.setState({
                user
            });
        });
    };
    toggleMenu = () => {
        this.setState({
            menuIsOpen: !this.state.menuIsOpen
        });
    };
    isMenuOpen = state => {
        this.setState({
            menuIsOpen: state.menuIsOpen
        });
    };
    setActive = id => {
        this.props.dispatch(updateCircle(id));
    };
    render() {
        const { user } = this.state;
        const {
            circles,
            activeCircle,
            activeChannel,
            location,
            searchOpen
        } = this.props;
        return (
            <div id='app-wrapper-outer' className='wrapper'>
                <PushingMenu
                    isOpen={this.state.menuIsOpen}
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
                        hide={
                            location.pathname !== '/app' &&
                            !/app\/circle\/CI[a-zA-Z\d]{24}$/.test(
                                location.pathname
                            )
                        }
                        user={user}
                        toggleOpenSearch={this.toggleOpenSearch}
                        searchOpen={searchOpen}
                    />
                    {searchOpen && (
                        <div
                            className='modal-mask'
                            onClick={this.clickOffSearch}>
                            <Search />
                        </div>
                    )}
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
                            path='/app/circle/:id'
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
        activeChannel: pull(state, 'activeChannel'),
        searchOpen: pullUI(state, 'searchOpen')
    };
}

export default withRouter(withGun(connect(mapStateToProps)(MobileLayout)));

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
