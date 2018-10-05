import React, { Component } from "react";
import "tachyons";
import "./styles/App.css";
import "./styles/swaloverride.css";

import { Route, withRouter } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import SplashPage from "./splash/landing";
import Roadmap from "./splash/roadmap";
import Login from "./portal/Login";
import Register from "./portal/Register";
import About from "./splash/about";
import NoMatch from "./404";
import DesktopLayout from "./app/DesktopLayout";
import MobileLayout from "./app/MobileLayout";
// import Loader from "./app/Loader";
import throttle from "lodash.throttle";
import { TweenMax } from "gsap";
import Gun from "gun";
import "gun/sea";
import "gun-synclist";
import "gun/lib/open";

import { GunProvider } from "react-gun";
import { connect } from "react-redux";
import { pull } from "./store/state/reducers";
import * as sync from "./store/state/actions";
import moment from "moment";

// IndexedDb stuff for later
// import "gun/lib/radix.js";
// import "gun/lib/radisk.js";
// import "gun/lib/store.js";
// import "gun/lib/rindexed.js";

let checkItemsTimer = null;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: window.innerWidth
        };
        // window.Gun = Gun;
        // For indexeddb support later
        //     var opt = {};
        // opt.store = RindexedDB(opt);
        // var gun = Gun(opt);
        this.gun = Gun();
        window.gun = this.gun;
        this.checkItemsTimer = checkItemsTimer;
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
        // check if user could log in
        if (sessionStorage.alias && sessionStorage.tmp) {
            this.gun.user().recall({ sessionStorage: true });
            let user = this.gun.user();
            await user.auth(sessionStorage.alias, sessionStorage.tmp, ack => {
                user.get("profile").once(profile => {
                    this.props.dispatch(sync.updateUser(profile.id));
                    this.props.dispatch(sync.updatePub(ack.pub));
                    // now that we're logged in, start listening to changes in nodes we care about
                    this.allListeners();
                });
            });
        }
        window.addEventListener("resize", throttle(this.updateWidth, 1000));
        this.routeFix();
    }
    getNext = () => {
        clearTimeout(this.checkItemsTimer);
        let now = moment().valueOf();
        let items = this.props.revisions
            .filter(i => !i.passed && moment(i.expires).valueOf() <= now)
            .sort(
                (a, b) =>
                    moment(a.expires).valueOf() < moment(b.expires).valueOf()
            );

        // find first occuring item, see if it has expired
        for (let i = 0, j = items.length; i < j; i++) {
            if (moment(items[i].expires).valueOf() <= now) {
                if (
                    this.props.amendments.findIndex(
                        a => a.revision === items[i].id
                    ) === -1
                ) {
                    // process this item
                    this.checkIfPass({
                        circleId: items[i].circle,
                        revisionId: items[i].id
                    });
                }
            } else if (moment(items[i].expires).valueOf() > now) {
                let time = moment(items[i].expires).valueOf() - now;
                this.checkItemsTimer = setTimeout(this.getNext, time);
                break;
            }
        }
        return;
    };
    // a revision has expired or crossed the voter threshold
    // see if it has passed and becomes an amendment
    checkIfPass = ({ circleId, revisionId }) => {
        let { votes, circles, revisions } = this.props;
        let thisCircle = circles.find(c => c.id === circleId);
        let thisRevision = revisions.find(r => r.id === revisionId);
        // just get the votes for this revision in this circle

        console.log(thisRevision);
        votes = votes.filter(
            v => v.circle === circleId && v.revision === revisionId
        );

        let supportVotes = votes.filter(v => v.support === true);
        // later filter out users who were created after this revision was created

        if (
            supportVotes > votes.length / 2 &&
            moment().valueOf() >= moment(thisRevision.expires).valueOf()
        ) {
            // it passes because the majority of votes has been reached after the expiry period
            this.createAmendment({
                id: thisRevision.id.replace("RV", "AM"),
                title: thisRevision.title,
                text: thisRevision.newText,
                revision: revisionId,
                circle: thisCircle.id
            });
        } else if (supportVotes.length >= thisRevision.voterThreshold) {
            // it passes because a sufficient number of people have voted yes such that the remaining eligble voters are unlikely to overturn the vote within the remaining time

            this.createAmendment({
                id: thisRevision.id.replace("RV", "AM"),
                title: thisRevision.title,
                text: thisRevision.text,
                revision: revisionId,
                circle: thisCircle.id
            });
        }
    };
    createAmendment = async pendingAmendment => {
        if (
            this.props.amendments.indexOf(
                a => a.circle === pendingAmendment.circle
            ) !== -1
        ) {
            alert(
                "Amendment already exists in this circle, I don't know how you did this."
            );
            return false;
        }
        // update the revision so that it can't continue to be voted on
        let gunRef = this.gun;
        let revision = gunRef.get(pendingAmendment.revision);
        revision.put({ passed: true, passedDate: moment().format() });
        revision.once(console.log, pendingAmendment.revision);
        let amendment = gunRef.get(pendingAmendment.id);
        amendment.put(pendingAmendment);

        gunRef.get("amendments").set(amendment);
        gunRef
            .get(pendingAmendment.circle)
            .get("amendments")
            .set(amendment);

        let user = gunRef.user();

        user.get("circles")
            .get(pendingAmendment.circle)
            .get("amendments")
            .set(amendment);
        user.get("amendments").set(amendment);
    };

    allListeners = () => {
        let user = this.gun.user();

        user.get("circles").synclist(obj => {
            this.props.dispatch(sync.circlesSync(obj));
            let channels = [];
            let messages = [];
            let amendments = [];
            let revisions = [];
            let votes = [];

            if (obj.list) {
                // get all data from this circle
                obj.list.forEach(circle => {
                    // get the channels and messages
                    if (circle.channels) {
                        let theseChannels = Object.values(circle.channels);
                        // channels = [...channels, ...theseChannels];
                        theseChannels.forEach(chan => {
                            if (chan.messages) {
                                // strip out messages from channel data
                                let {
                                    messages: theseMessages,
                                    ...thisChan
                                } = chan;
                                channels.push(thisChan);

                                theseMessages = Object.values(theseMessages);
                                messages = [...messages, ...theseMessages];
                            } else {
                                channels.push(chan);
                            }
                        });
                    }
                    // get other stuff like amendments and revisions
                    if (circle.amendments) {
                        amendments = [
                            ...amendments,
                            ...Object.values(circle.amendments)
                        ];
                    }
                    if (circle.revisions) {
                        let theseRevisions = Object.values(circle.revisions);
                        theseRevisions.forEach(rev => {
                            if (rev.votes) {
                                // strip out votes from revision data
                                let { votes: theseVotes, ...thisRev } = rev;
                                revisions.push(thisRev);

                                theseVotes = Object.values(theseVotes);
                                votes = [...messages, ...theseVotes];
                            } else {
                                revisions.push(rev);
                            }
                        });
                    }
                });
                this.props.dispatch(sync.setMessages(messages));
                this.props.dispatch(sync.setChannels(channels));
                this.props.dispatch(sync.setAmendments(amendments));
                this.props.dispatch(sync.setRevisions(revisions));
                this.props.dispatch(sync.setVotes(votes));
                this.getNext();
            }
        });
        // also find a way to get private channels
        // user.get("channels").synclist(obj => {
        //     this.props.dispatch(sync.channelsSync(obj));
        // });
    };
    routeFix = () => {
        document
            .getElementById("root")
            .addEventListener("mousemove", this.parallaxApp, true);
        document.getElementById("root").style.overflow = "hidden";
    };
    parallaxApp = e => {
        if (this.state.width < 992) {
            return false;
        }
        this.parallaxIt(e, "#desktop-wrapper-outer", 30, "#main-layout");
        this.parallaxIt(e, "#main-layout", -30, "#main-layout");
    };
    componentWillUnmount() {
        window.addEventListener("resize", throttle(this.updateWidth, 1000));
        document.getElementById("root").addEventListener("mousemove", e => {
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
            <div className="wrapper high-img" id="main-layout">
                <div id="desktop-wrapper-outer" className="wrapper">
                    <div className="wrapper grey-screen" id="desktop-wrapper">
                        <GunProvider gun={this.gun}>
                            <AnimatedSwitch
                                atEnter={{ opacity: 0 }}
                                atLeave={{ opacity: 0 }}
                                atActive={{ opacity: 1 }}
                                className="wrapper switch-wrapper"
                            >
                                <Route
                                    exact
                                    path="/login"
                                    component={props => (
                                        <Login
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/register"
                                    component={props => (
                                        <Register
                                            {...props}
                                            listen={this.allListeners}
                                        />
                                    )}
                                />
                                <Route exact path="/" component={SplashPage} />
                                <Route
                                    exact
                                    path="/roadmap"
                                    component={Roadmap}
                                />
                                <Route exact path="/about" component={About} />
                                <Route
                                    path="/app"
                                    render={props =>
                                        this.state.width >= 992 ? (
                                            <DesktopLayout {...props} />
                                        ) : (
                                            <MobileLayout {...props} />
                                        )
                                    }
                                />
                                {/* <Route exact path="/test" component={Test} /> */}
                                <Route component={NoMatch} />
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
        user: pull(state, "user"),
        revisions: pull(state, "revisions"),
        votes: pull(state, "votes"),
        amendments: pull(state, "amendments"),
        circles: pull(state, "circles")
    };
}
export default withRouter(connect(mapStateToProps)(App));
