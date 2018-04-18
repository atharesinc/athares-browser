import React, { Component } from "react";
import FeatherIcon from "feather-icons-react";
import RevisionHeader from "./RevisionHeader";
import RevisionStats from "./RevisionStats";
import VoteButtons from "./VoteButtons";
import RevisionStatus from "./RevisionStatus";
import ToggleDiffBar from "./ToggleDiffBar";
import DiffSection from "./DiffSection";

export default class ViewRevision extends Component {
    state = {
        mode: 0
    };
    toggleMode = num => {
        this.setState({
            mode: num
        });
    };
    accept = () => {
        console.log("accepted");
    };
    reject = () => {
        console.log("rejected");
    };
    render() {
        // const {
        //  amendment,
        //  newText,
        //  createdAt,
        //  backer,
        //  votes,
        //  title,
        //  id
        // } = this.props;

        const {
            amendment,
            oldText,
            newText,
            createdAt,
            ratified,
            updatedAt,
            backer,
            votes,
            title,
            id
        } = revision;

        const support = votes.filter(({ support }) => support).length;

        if (amendment !== null) {
            /* Represents a change to existing legislation; Show diff panels
    */
            return (
                <div id="revisions-wrapper">
                    <RevisionHeader title={title} isNew={amendment === null} />
                    <div className="bg-theme ma2 ma4-ns">
                        <RevisionStatus {...revision} support={support} />
                        <DiffSection {...revision} mode={this.state.mode} />
                        <ToggleDiffBar
                            mode={this.state.mode}
                            toggle={this.toggleMode}
                        />
                        <RevisionStats {...revision} support={support} />
                        <VoteButtons
                            accept={this.accept}
                            reject={this.reject}
                        />
                    </div>
                </div>
            );
        } else {
            /* Represents a new legislation without precedent; Show single panel */
            return (
                <div id="revisions-wrapper">
                    <RevisionHeader title={title} isNew={amendment === null} />

                    <div className="bg-theme ma4">
                        <RevisionStatus {...revision} support={support} />
                        <div className="pa3 white pre-wrap">{newText}</div>
                        <RevisionStats {...revision} support={support} />
                        <VoteButtons
                            accept={this.accept}
                            reject={this.reject}
                        />
                    </div>
                </div>
            );
        }
    }
}

const revision = {
    id: "1",
    createdAt: new Date().getTime() - 37 * 1000 + 37 * 100,
    updatedAt: new Date(
        new Date().getTime() - 86400000 * Math.floor(Math.random() * 8)
    ),
    oldText:
        "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.",
    newText: `All legislative Pwers. Herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.


kjsndfkjsndkfjn  sdf sadf sdf sdf 


sdfsdfsdf`,
    amendment: { id: 4 },
    title: "Deep Space Exploration Act",
    ratified: true,
    backer: {
        firstName: "Erlich",
        lastName: "Bachmann",
        icon: "http://mrmrs.github.io/photos/p/2.jpg"
    },
    votes: fakeVotes()
};
function fakeVotes() {
    const num = Math.floor(Math.random() * 50 + 1);
    const votes = [];
    for (let i = 0; i < num; ++i) {
        votes.push({ id: num + i, support: Math.random() > 0.5 });
    }
    return votes;
}
