import React, { Component } from "react";
import RevisionHeader from "./RevisionHeader";
import RevisionStats from "./RevisionStats";
import VoteButtons from "./VoteButtons";
import RevisionStatus from "./RevisionStatus";
import ToggleDiffBar from "./ToggleDiffBar";
import DiffSection from "./DiffSection";
import HasVoted from "./HasVoted";

import { getRevision, getUserLocal } from "../../../graphql/queries";
import { createVote, updateVote } from "../../../graphql/mutations";

import { compose, graphql } from "react-apollo";
import Loader from "../../Loader.js";
import { withRouter } from "react-router-dom";

class ViewRevision extends Component {
    state = {
        mode: 0
    };
    toggleMode = num => {
        this.setState({
            mode: num
        });
    };
    vote = async support => {
        const hasVoted = this.props.getRevision.Revision.votes.find(
            ({ user: { id } }) => id === this.props.getUserLocal.user.id
        );
        console.log(hasVoted);

        if (hasVoted === undefined) {
            console.log("casting your vote");
            /* user hasn't voted */
            await this.props.createVote({
                variables: {
                    support,
                    revisionId: this.props.match.params.id,
                    userId: this.props.getUserLocal.user.id
                }
            });
        } else {
            console.log("updating your vote");
            await this.props.updateVote({
                variables: {
                    support,
                    id: hasVoted.id
                }
            });
        }
        this.props.getRevision.refetch();
    };
    render() {
        const { error, loading, Revision } = this.props.getRevision;
        console.log(this.props.match);
        if (error) {
            return null;
        }
        if (loading) {
            return (
                <div
                    id="docs-wrapper"
                    className="column-center"
                    style={{ overflowY: "scroll" }}
                >
                    <Loader />
                    <div className="f3 pb2 b mv4 tc">Fetching Revision</div>
                </div>
            );
        }
        const revision = Revision;
        const { amendment, newText, votes, title } = Revision;

        const support = votes.filter(({ support }) => support).length;
        const hasVoted = revision.votes.find(
            ({ user: { id } }) => id === this.props.getUserLocal.user.id
        );
        if (amendment !== null) {
            /* Represents a change to existing legislation; Show diff panels
    */
            return (
                <div id="revisions-wrapper">
                    <RevisionHeader title={title} isNew={amendment === null} />

                    {hasVoted && <HasVoted vote={hasVoted} />}
                    <div className="bg-theme ma2 ma4-ns">
                        <RevisionStatus {...revision} support={support} />
                        <DiffSection {...revision} mode={this.state.mode} />
                        <ToggleDiffBar
                            mode={this.state.mode}
                            toggle={this.toggleMode}
                        />
                        <RevisionStats {...revision} support={support} />
                        <VoteButtons vote={this.vote} />
                    </div>
                </div>
            );
        } else {
            /* Represents a new legislation without precedent; Show single panel */
            return (
                <div id="revisions-wrapper">
                    <RevisionHeader title={title} isNew={amendment === null} />
                    {hasVoted && <HasVoted vote={hasVoted} />}

                    <div className="bg-theme ma4">
                        <RevisionStatus {...revision} support={support} />
                        <div className="pa3 white pre-wrap">{newText}</div>
                        <RevisionStats {...revision} support={support} />
                        <VoteButtons vote={this.vote} />
                    </div>
                </div>
            );
        }
    }
}

const WrappedViewRevision = compose(
    graphql(getUserLocal, { name: "getUserLocal" }),
    graphql(getRevision, {
        name: "getRevision",
        options: ({ match: { params: { id } } }) => ({ variables: { id } })
    }),
    graphql(createVote, { name: "createVote" }),
    graphql(updateVote, { name: "updateVote" })
)(ViewRevision);

export default withRouter(WrappedViewRevision);

// const revision = {
//     id: "1",
//     createdAt: new Date().getTime() - 37 * 1000 + 37 * 100,
//     updatedAt: new Date(
//         new Date().getTime() - 86400000 * Math.floor(Math.random() * 8)
//     ),
//     oldText:
//         "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.",
//     newText: `All legislative Pwers. Herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.

// kjsndfkjsndkfjn  sdf sadf sdf sdf

// sdfsdfsdf`,
//     amendment: { id: 4 },
//     title: "Deep Space Exploration Act",
//     ratified: true,
//     backer: {
//         firstName: "Erlich",
//         lastName: "Bachmann",
//         icon: "http://mrmrs.github.io/photos/p/2.jpg"
//     },
//     votes: fakeVotes()
// };
// function fakeVotes() {
//     const num = Math.floor(Math.random() * 50 + 1);
//     const votes = [];
//     for (let i = 0; i < num; ++i) {
//         votes.push({ id: num + i, support: Math.random() > 0.5 });
//     }
//     return votes;
// }
