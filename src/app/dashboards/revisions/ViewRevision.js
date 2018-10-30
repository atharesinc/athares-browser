import React, { Component } from "react";
import RevisionHeader from "./RevisionHeader";
import RevisionStats from "./RevisionStats";
import VoteButtons from "./VoteButtons";
import RevisionStatus from "./RevisionStatus";
import ToggleDiffBar from "./ToggleDiffBar";
import DiffSection from "./DiffSection";
import HasVoted from "./HasVoted";
import { Scrollbars } from "react-custom-scrollbars";
import { updateRevision, updateChannel } from "../../../store/state/actions";
import Gun from "gun/gun";
import Loader from "../../Loader.js";
import moment from "moment";
import { withGun } from "react-gun";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

class ViewRevision extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
            revision: null,
            backer: null
        };
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        if (this.props.activeRevision && this.props.activeRevision === this.props.match.params.id) {
            this.getRevision();
        } else {
            this.props.dispatch(updateRevision(this.props.match.params.id));
            this.props.dispatch(updateChannel(null));
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeRevision !== this.props.activeRevision) {
            // go get that new revision dude!
            this.getRevision();
        }
    }
    getRevision = () => {
        let revisionID = this.props.activeRevision;
        let gunRef = this.props.gun;

        gunRef.get(revisionID).open(revision => {
            this._isMounted &&
                this.setState({
                    revision: {
                        ...revision,
                        votes: Object.values(revision.votes)
                    }
                });
        });
    };
    toggleMode = num => {
        this.setState({
            mode: num
        });
    };
    vote = async support => {
        // user should be signed in so this.props.votes should be populated
        let { activeCircle } = this.props;
        let activeRevision = this.props.match.params.id;

        let user = this.props.gun.user();

        // check this revision's votes
        let myVote = this.state.revision.votes.find(
            v => v.user === this.props.user && activeRevision === v.revision
        );

        let gunRef = this.props.gun;
        if (myVote !== undefined) {
            // simply update this vote node
            gunRef.get(myVote.id).put({ support });

            // and also in the user's circle...vote
            user.get("circles")
                .get(activeCircle)
                .get("revisions")
                .get(activeRevision)
                .get("votes")
                .get(myVote.id)
                .put({ support });
        } else {
            // create vote object
            myVote = {
                id: "VO" + Gun.text.random(),
                circle: activeCircle,
                revision: activeRevision,
                user: this.props.user,
                support
            };

            // create vote node in gun
            let vote = gunRef.get(myVote.id);
            vote.put(myVote);

            // update it in all the places
            gunRef
                .get(activeRevision)
                .get("votes")
                .set(vote);
            gunRef.get("votes").set(vote);
            gunRef
                .get(activeCircle)
                .get("revisions")
                .get(activeRevision)
                .get("votes")
                .get(myVote.id)
                .set(vote);
            user.get("circles")
                .get(activeCircle)
                .get("revisions")
                .get(activeRevision)
                .get("votes")
                .set(vote);
            user.get("votes").set(vote);
        }
    };
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { revision } = this.state;

        // let revision = null;
        // let votes = [];
        // if (this.state.revision) {
        //     revision = this.state.revision;
        //     votes = revision.votes;
        // } else if (revisions.length !== 0 && activeRevision !== null) {
        //     revision =
        //         revisions.find(({ id }) => id === activeRevision) || null;
        //     votes = this.props.votes;
        // }
        if (revision && revision.backer) {
            const { newText, title, votes } = revision;

            const support = votes.filter(({ support }) => support).length;
            const hasVoted = votes.find(
                ({ user: id }) => id === this.props.user
            );
            const hasExpired =
                moment().valueOf() >= moment(revision.expires).valueOf();
            if (revision.amendment) {
                /* Represents a change to existing legislation; Show diff panels   */
                return (
                  <div id="revisions-wrapper">
                <div className="flex db-ns ph2 mobile-nav">
                    <Link
                        to="/app"
                        className="flex justify-center items-center"
                    >
                        <FeatherIcon
                            icon="chevron-left"
                            className="white db dn-ns"
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className="ma3 lh-title white">{title}</h2>
                </div>
                        <Scrollbars style={{ height: "90vh", width: "100%" }}>
                            <RevisionHeader title={title} isNew={false} />

                            {hasVoted && <HasVoted vote={hasVoted} />}
                            <div className="bg-theme ma2 ma4-ns">
                                <RevisionStatus
                                    {...revision}
                                    support={support}
                                />
                                <DiffSection
                                    {...revision}
                                    mode={this.state.mode}
                                />
                                {revision.amendment && (
                                    <ToggleDiffBar
                                        mode={this.state.mode}
                                        toggle={this.toggleMode}
                                    />
                                )}
                                <RevisionStats
                                    {...revision}
                                    support={support}
                                    hasExpired={hasExpired}
                                />
                                {this.props.user &&
                                    !hasExpired && (
                                        <VoteButtons vote={this.vote} />
                                    )}{" "}
                            </div>
                        </Scrollbars>
                    </div>
                );
            } else {
                /* Represents a new legislation without precedent; Show single panel */
                return (
                   <div id="revisions-wrapper">
                <div className="flex db-ns ph2 mobile-nav">
                    <Link
                        to="/app"
                        className="flex justify-center items-center"
                    >
                        <FeatherIcon
                            icon="chevron-left"
                            className="white db dn-ns"
                            onClick={this.back}
                        />
                    </Link>
                    <h2 className="ma3 lh-title white">{title}</h2>
                </div>
                        <Scrollbars style={{ height: "90vh", width: "100%" }}>
                            <RevisionHeader title={title} isNew={true} />
                            {hasVoted && <HasVoted vote={hasVoted} />}

                            <div className="bg-theme ma2 ma4-ns">
                                <RevisionStatus
                                    {...revision}
                                    support={support}
                                />
                                <div className="pa3 white pre-wrap">
                                <Scrollbars style={{height: "11em", width: "100%"}}>
                                    {newText}
                                    </Scrollbars>
                                </div>
                                <RevisionStats
                                    {...revision}
                                    support={support}
                                    hasExpired={hasExpired}
                                />
                                {this.props.user &&
                                    !hasExpired && (
                                        <VoteButtons vote={this.vote} />
                                    )}{" "}
                            </div>
                        </Scrollbars>
                    </div>
                );
            }
        } else {
            return (
                <div id="docs-wrapper" className="column-center">
                    <Loader />
                    <div className="f3 pb2 b mv4 tc">Fetching Revision</div>
                </div>
            );
        }
    }
}
function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle"),
        activeRevision: pull(state, "activeRevision")
    };
}

export default withGun(withRouter(connect(mapStateToProps)(ViewRevision)));

