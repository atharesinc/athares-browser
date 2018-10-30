import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Loader from "../../Loader";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import { withGun } from "react-gun";
import {updateChannel, updateRevision, updateCircle} from "../../../store/state/actions";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";
import FeatherIcon from "feather-icons-react";

class RevisionBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            circle: null,
            revisions: []
        };
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;

        if(this.props.activeCircle){
            this._isMounted && this.getRevisions();
        } else {
            this.props.dispatch(updateChannel(null));
            this.props.dispatch(updateRevision(null));
            this.props.dispatch(updateCircle(this.props.match.params.id));
        }
    }
    componentDidUpdate(prevProps){
        if(this.props.activeCircle !== prevProps.activeCircle){
            this.getRevisions();
        }
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    getRevisions = () => {
        this.props.gun.get(this.props.activeCircle).open(thisCircle => {
            let {revisions, channels, amendments, ...circle} = thisCircle;

            this._isMounted && this.setState({
                revisions: revisions ? Object.values(revisions) : [],
                circle
            });
        });
    }
    render() {
        let {activeCircle, user} = this.props;
        // let circle = circles.find(c => c.id === activeCircle);
        let {circle, revisions: allRevisions} = this.state;
        if (!circle) {
            return (
                <div
                    id="revisions-wrapper"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <h1 className="ma3 lh-title white">Revisions</h1>
                    <small className="f6 white-80 db mb4 ml3">
                        Review proposed legislation and changes to existing laws
                    </small>

                    <Loader />
                </div>
            );
        }
        // votes = votes.filter(v => v.circle === activeCircle);
        allRevisions = allRevisions.filter(r => r.circle === activeCircle);
        allRevisions = allRevisions.map(r => {
            return {
                ...r,
                votes: this.props.votes.filter(v => v.revision === r.id)
            };
        });
        let now = moment().valueOf();

        // all non-expired revisions
        let newRevisions = allRevisions.filter(r => r.passed === undefined);
        // passed in the last week
        let recentlyPassed = allRevisions.filter(
            r =>
                r.passed === true &&
                now - moment(r.expires).valueOf() <= 604800000
        );
        // rejected in the last week
        let recentlyRejected = allRevisions.filter(
            r =>
                r.passed === false &&
                now - moment(r.expires).valueOf() <= 604800000
        );
        // let revisions = [newRevisions, recentlyPassed, recentlyRejected];
        // console.log(revisions);
        return (
            <div id="revisions-wrapper">
                <div className="flex db-ns ph2 mobile-nav" style={{height: "10vh"}}>
                    <Link to="/app" className="flex justify-center items-center">
                        <FeatherIcon
                            icon="chevron-left"
                            className="white db dn-ns"
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className="ma3 lh-title white">Revisions</h2>
                </div>
                <small className="f6 white-80 db mb2 ml3 mobile-nav" style={{height: "10vh"}}>
                    Review proposed legislation and changes to existing laws
                </small>
                <div id="revision-board-wrapper">
                    <Scrollbars
                        style={{
                            height: "80vh",
                            width: "100%",
                            // overflowY: "none"
                        }}
                    >
                        <Board
                            revisions={newRevisions}
                            title={"New Revisions"}
                            circleID={activeCircle}
                            user={user}
                        />
                        <Board
                            revisions={recentlyPassed}
                            title={"Recently Passed"}
                            circleID={activeCircle}
                            user={user}
                        />
                        <Board
                            revisions={recentlyRejected}
                            title={"Recently Rejected"}
                            circleID={activeCircle}
                            user={user}
                        />
                    </Scrollbars>
                </div>
            </div>
        );
    }
}

const Board = ({ title, revisions, circleID, user }) => {
    return (
        <div className="w-50 mv2 ml2 pa2 revision-board">
            <div className="bb b--white pa2 mb2">
                <div className="white">{title}</div>
            </div>
            <div style={{
                display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "28em"
                }}>
            <Scrollbars
                style={{
                    height: "28em",
                    minHeight: "11.5em"
                }}
            >
                {title === "New Revisions" && user && 
                <Link to={`/app/circle/${circleID}/add/amendment`}>
                    <div className="random-button transparent-hover-white mb2">
                        <FeatherIcon icon="plus" className="pr2" />
                        <span>Create Revision</span>
                    </div>
                </Link>}
                {revisions.map((rev, i) => (
                    <RevisionWithRouter key={i} {...rev} />
                ))}
            </Scrollbars>
            </div>
        </div>
    );
};

// Denote vote split
// denote whether it is new or a change to existing amendment
const RevisionCard = ({
    amendment = null,
    newText,
    createdAt,
    backer,
    votes,
    title,
    id,
    ...props
}) => {
    const support = votes.filter(({ support }) => support).length;
    return (
        <Link to={`${props.match.url}/${id}`}>
        <div style={{marginBottom: "0.5em", color: "#FFF"}}>
            <h1 className="f6 bg-theme-light white-80 mv0 ph3 pv2">
                {title}
            </h1>
            <div className="pa3 bg-theme">
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    className="mb2"
                >
                    <div
                        className={`f7 white pa1 br-pill ph2 lh-solid bg-${
                            amendment !== null ? "theme-blue" : "green"
                        }`}
                    >
                        {amendment !== null ? "REVISION" : "NEW"}
                    </div>
                    <small>
                        <span className="light-green">+{support}</span> /{" "}
                        <span className="red">-{votes.length - support}</span>
                    </small>
                </div>
                <p
                    className="f7 lh-copy measure mv3 white pre-wrap h2"
                    style={{ overflow: "hidden" }}
                >
                    {newText}
                </p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}
                    className="mt2"
                >
                    <img
                        src={backer.icon}
                        className="db br-100 w2 h2 mr2"
                        alt=""
                    />
                    <small className="f6 white-70 db ml2">
                        {moment(createdAt).format("MM/DD/YY hh:mma")}
                    </small>
                </div>
            </div>
            </div>
        </Link>
    );
};
const RevisionWithRouter = withRouter(RevisionCard);

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle"),
        revisions: pull(state, "revisions"),
        circles: pull(state, "circles"),
        votes: pull(state, "votes")
    };
}

export default withGun(withRouter(connect(mapStateToProps)(RevisionBoard)));
