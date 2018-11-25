import React, { PureComponent } from 'react';
import 'tachyons';
import './styles/App.css';
import './styles/swaloverride.css';

import { Route, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';

import SplashPage from './splash/landing';
import Roadmap from './splash/roadmap';
import Login from './portal/Login';
import Register from './portal/Register';
import About from './splash/about';
import NoMatch from './404';
import Policy from './policy';
import DesktopLayout from './app/DesktopLayout';
import MobileLayout from './app/MobileLayout';
// import Loader from "./app/Loader";
import throttle from 'lodash.throttle';
import { TweenMax } from 'gsap';
import Gun from 'gun';
import 'gun/sea';
import 'gun-synclist';
import 'gun/lib/open';
import 'gun/lib/unset';

import { GunProvider } from 'react-gun';
import { connect } from 'react-redux';
import { pull } from './store/state/reducers';
import * as sync from './store/state/actions';
import moment from 'moment';

// web worker stuff
import worker from './workers/listener-worker';
import WebWorker from './workers/WebWorker';
// IndexedDb stuff for later
// import "gun/lib/radix.js";
// import "gun/lib/radisk.js";
// import "gun/lib/store.js";
// import "gun/lib/rindexed.js";

let checkItemsTimer = null;

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth
        };
        // For indexeddb support later
        //     var opt = {};
        // opt.store = RindexedDB(opt);
        // var gun = Gun(opt);
        this.gun = Gun([
            'https://athares-gun.now.sh/gun'
            // 'http://localhost:3000/gun'
        ]);
        // this.gun = Gun();
        // if (process.env.NODE_ENV !== "production") {
        window.gun = this.gun;
        // }
        this.checkItemsTimer = checkItemsTimer;
        // let user = this.gun.user();
        // user.recall({ sessionStorage: true });
    }
    updateWidth = () => {
        this.setState({
            width: window.innerWidth
        });
    };
    componentDidUpdate() {
        this.routeFix();
    }
    async componentDidMount() {
        // experimental web worker stuff
        this.worker = new WebWorker(worker);
        this.gun.get('circles');
        this.gun.get('channels');

        this.worker.addEventListener('message', event => {
            // update redux
            let {
                messages,
                channels,
                amendments,
                revisions,
                votes,
                circles
            } = event.data;
            this.props.dispatch(sync.circlesSync(circles));
            messages.length !== 0 &&
                this.props.dispatch(sync.setMessages(messages));
            channels.length !== 0 &&
                this.props.dispatch(sync.setChannels(channels));
            amendments.length !== 0 &&
                this.props.dispatch(sync.setAmendments(amendments));
            revisions.length !== 0 &&
                this.props.dispatch(sync.setRevisions(revisions));
            votes.length !== 0 && this.props.dispatch(sync.setVotes(votes));
            this.getNext();
        });

        // check if user could log in
        if (sessionStorage.alias && sessionStorage.tmp) {
            this.gun.user().recall({ sessionStorage: true });
            let user = this.gun.user();
            await user.auth(sessionStorage.alias, sessionStorage.tmp, ack => {
                user.get('profile').once(profile => {
                    this.props.dispatch(sync.updateUser(profile.id));
                    this.props.dispatch(sync.updatePub(ack.pub));
                    // now that we're logged in, start listening to changes in nodes we care about
                    this.allListeners();
                });
            });
        }
        window.addEventListener('resize', throttle(this.updateWidth, 1000));
        this.routeFix();
    }
    getNext = () => {
        // console.log("getting the next revision to look out for");
        clearTimeout(this.checkItemsTimer);
        let now = moment().valueOf();
        let { revisions } = this.props;

        let items = revisions
            .filter(i => i.passed === undefined)
            .sort(
                (a, b) =>
                    moment(a.expires).valueOf() - moment(b.expires).valueOf()
            );
        // console.log(now);
        // console.log(items);
        // find soonest ending item, see if it has expired
        for (let i = 0, j = items.length; i < j; i++) {
            if (moment(items[i].expires).valueOf() <= now) {
                // process this item
                // console.log(
                //     "check this revsion:",
                //     moment(items[i].expires).valueOf()
                // );
                this.checkIfPass({
                    circleId: items[i].circle,
                    revisionId: items[i].id
                });
                break;
            } else if (moment(items[i].expires).valueOf() > now) {
                // there aren't any revisions that need to be processed, set a timer for the soonest occurring one
                let time = moment(items[i].expires).valueOf() - now;
                // console.log(time);
                // console.log("Setting a timer for " + time / 1000 + "seconds");
                this.checkItemsTimer = setTimeout(this.getNext, time);
                break;
            }
        }
        return;
    };
    // a revision has expired or crossed the voter threshold
    // see if it has passed and becomes an amendment or fails and lives in infamy
    checkIfPass = ({ circleId, revisionId }) => {
        let { votes, circles, revisions } = this.props;
        let thisCircle = circles.find(c => c.id === circleId);
        let thisRevision = revisions.find(r => r.id === revisionId);
        // just get the votes for this revision in this circle

        votes = votes.filter(
            v => v.circle === circleId && v.revision === revisionId
        );

        let supportVotes = votes.filter(v => v.support === true);
        // later filter out users who were created after this revision was created

        // // it passes because the majority of votes has been reached after the expiry period
        if (
            supportVotes.length > votes.length / 2 &&
            moment().valueOf() >= moment(thisRevision.expires).valueOf()
        ) {
            // console.log(
            //     "we're creating this amendment because a majority has been reached"
            // );
            this.createAmendment({
                id: thisRevision.id.replace('RV', 'AM'),
                title: thisRevision.title,
                text: thisRevision.newText,
                revision: thisRevision.id,
                circle: thisCircle.id
            });
        } else if (supportVotes.length >= thisRevision.voterThreshold) {
            // it passes because a sufficient number of people have voted yes such that the remaining eligble voters are unlikely to overturn the vote within the remaining time
            // console.log(
            //     "we're creating this amendment because the critical threshold has been reached"
            // );

            this.createAmendment({
                id: thisRevision.id.replace('RV', 'AM'),
                title: thisRevision.title,
                text: thisRevision.newText,
                revision: thisRevision.id,
                circle: thisCircle.id
            });
        } else {
            // it fails and we can ignore it forever
            this.rejectRevision(thisRevision);
        }
        // if the revision does not pass, it simply gets ignored, and the RevisionBoard component will mark it as such
    };
    rejectRevision = async rejectedRevision => {
        // update the revision so that it can't continue to be voted on
        let gunRef = this.gun;
        let revision = gunRef.get(rejectedRevision.id);
        let user = gunRef.user();

        revision.put({
            passed: false,
            updatedAt: moment().format()
        });

        user.get('circles')
            .get(rejectedRevision.circle)
            .get('revisions')
            .get(rejectedRevision.id)
            .put({
                passed: false,
                updatedAt: moment().format()
            });
    };
    createAmendment = async pendingAmendment => {
        // update the revision so that it can't continue to be voted on
        let gunRef = this.gun;
        let revision = gunRef.get(pendingAmendment.revision);
        revision.put({
            passed: true,
            passedDate: moment().format(),
            updatedAt: moment().format()
        });

        let amendment = gunRef.get(pendingAmendment.id);
        amendment.put({
            ...pendingAmendment,
            createdAt: moment().format(),
            updatedAt: moment().format()
        });

        gunRef.get('amendments').set(amendment);
        gunRef
            .get(pendingAmendment.circle)
            .get('amendments')
            .set(amendment);

        let user = gunRef.user();

        user.get('circles')
            .get(pendingAmendment.circle)
            .get('amendments')
            .set(amendment);
        user.get('amendments').set(amendment);

        // if the newly minted amendment is the result of a change to an existing amendment, we need to delete the old amendment
        gunRef.get(pendingAmendment.revision).once(revision => {
            if (revision.amendment) {
                gunRef.get(revision.amendment).once(oldAmendment => {
                    oldAmendment = gunRef.get(oldAmendment.id);

                    // remove it from the general list of amendments
                    gunRef.get('amendments').unset(oldAmendment);
                    // remove it from it's parent circle
                    gunRef
                        .get(pendingAmendment.circle)
                        .get('amendments')
                        .unset(oldAmendment);
                });
            }
        });
    };

    allListeners = () => {
        let gunRef = this.gun;
        let user = gunRef.user();
        user.get('circles').synclist(obj => {
            this.worker.postMessage(obj);
        });
        // listen for circle requests
        user.get('profile').once(({ circleChain }) => {
            // console.log(circleChain);
            gunRef.get(circleChain).synclist(obj => {
                // console.log(obj.list);
                if (!obj.list) {
                    return;
                }
                obj.list.forEach(circleId => {
                    // circleId will be null once accepted
                    if (circleId) {
                        let thisCircle = gunRef.get(circleId);
                        // add the circle to this user's reference and remove the request from their keychain
                        user.get('circles').set(thisCircle);
                        gunRef.get(circleChain).unset(thisCircle);
                    }
                });
            });
        });
        // user.get("profile").once(profile =>{
        //     // get this users list of DMs and subcribe to each one
        //     this.gun.get(profile.keychain).synclist(obj => {
        //         if(obj.list){
        //             let values = Object.values(obj.list);
        //             obj.list = values.filter(c => c !== null)

        //             // attach listener to each channel's messages
        //             obj.list.forEach(dm => {
        //                 this.gun.get(dm.id).get("messages").synclist(obj => {
        //                     this.props.dispatch(sync.syncDMMessages(obj))
        //                 });
        //             });
        //         }
        //         this.props.dispatch(sync.syncDM(obj));
        //     });
        // });
    };
    routeFix = () => {
        document
            .getElementById('root')
            .addEventListener('mousemove', this.parallaxApp, true);
        document.getElementById('root').style.overflow = 'hidden';
    };
    parallaxApp = e => {
        if (this.state.width < 992) {
            return false;
        }
        this.parallaxIt(e, '#desktop-wrapper-outer', 30, '#main-layout');
        this.parallaxIt(e, '#main-layout', -30, '#main-layout');
    };
    componentWillUnmount() {
        window.addEventListener('resize', throttle(this.updateWidth, 1000));
        document.getElementById('root').addEventListener('mousemove', e => {
            e.stopPropogation();
            e.preventDefault();
        });
    }
    parallaxIt = (e, target, movement, rootElement) => {
        var $this = document.querySelector(rootElement);
        var relX = e.pageX - $this.offsetLeft;
        var relY = e.pageY - $this.offsetTop;

        const height = window.innerHeight * 0.9,
            width = window.innerWidth * 0.9;
        TweenMax.to(target, 1.25, {
            x: ((relX - width / 2) / width) * movement,
            y: ((relY - height / 2) / height) * movement
        });
    };

    render() {
        return (
            <div className='wrapper high-img' id='main-layout'>
                <div id='desktop-wrapper-outer' className='wrapper'>
                    <div className='wrapper grey-screen' id='desktop-wrapper'>
                        <GunProvider gun={this.gun} SEA={Gun.SEA}>
                            <AnimatedSwitch
                                atEnter={{ opacity: 0 }}
                                atLeave={{ opacity: 0 }}
                                atActive={{ opacity: 1 }}
                                className='wrapper switch-wrapper'>
                                <Route
                                    exact
                                    path='/login'
                                    render={props => (
                                        <Login
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path='/register'
                                    render={props => (
                                        <Register
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path='/'
                                    render={() => <SplashPage />}
                                />
                                <Route
                                    exact
                                    path='/roadmap'
                                    render={() => <Roadmap />}
                                />
                                <Route
                                    exact
                                    path='/about'
                                    render={() => <About />}
                                />
                                <Route
                                    exact
                                    path='/policy'
                                    render={() => <Policy />}
                                />
                                <Route
                                    path='/app'
                                    render={props =>
                                        this.state.width >= 992 ? (
                                            <DesktopLayout {...props} />
                                        ) : (
                                            <MobileLayout {...props} />
                                        )
                                    }
                                />
                                {/* <Route exact path="/test" component={Test} /> */}
                                <Route render={NoMatch} />
                            </AnimatedSwitch>
                        </GunProvider>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, 'user'),
        revisions: pull(state, 'revisions'),
        votes: pull(state, 'votes'),
        amendments: pull(state, 'amendments'),
        circles: pull(state, 'circles')
    };
}
export default withRouter(connect(mapStateToProps)(App));
