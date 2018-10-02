import React, { Component } from "react";
import RevisionHeader from "./RevisionHeader";
import RevisionStats from "./RevisionStats";
import VoteButtons from "./VoteButtons";
import RevisionStatus from "./RevisionStatus";
import ToggleDiffBar from "./ToggleDiffBar";
import DiffSection from "./DiffSection";
import HasVoted from "./HasVoted";
import { Scrollbars } from "react-custom-scrollbars";
import { withGun } from "react-gun";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";

import Loader from "../../Loader.js";
import { withRouter } from "react-router-dom";

class ViewRevision extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 0,
      revision: revision
    };
  }
  componentDidMount() {
    // // get this revision, it's amendment if applicable, and it's votes
    // let revRef = this.props.gun.get("revisions").get(this.props.activeRevision);
    // let amendRef = this.props.gun.get("amendments");
    // let votes = [];
    // revRef.once(revision => {
    //   revRef.get("votes").map(vote => {
    //     votes.push(vote);
    //   });
    //   this.props.gun.get("users").get(revision.backer).once(user => {
    //      revision.backer = user
    //     })
    //   if (revision.amendment && revision.amendment !== "") {
    //     // get the amendment and replace the id with the whole object
    //     // typeof revision.amendment === string -> revision.amendment = {...amendment}
    //     amendRef.get(revision.amendment).once(amendment => {
    //       revision.amendment = amendment;
    //       this.setState({
    //         revision: { ...revision, votes }
    //       });
    //     });
    //   } else {
    //     this.setState({
    //       revision: {
    //         ...revision,
    //         votes
    //       }
    //     });
    //   }
    // });
  }

  toggleMode = num => {
    this.setState({
      mode: num
    });
  };
  vote = async support => {
    // const hasVoted = this.props.getRevision.Revision.votes.find(
    //   ({ user: { id } }) => id === this.props.getUserLocal.user.id
    // );
    // console.log(hasVoted);
    // if (hasVoted === undefined) {
    //   console.log("casting your vote");
    //   /* user hasn't voted */
    //   await this.props.createVote({
    //     variables: {
    //       support,
    //       revisionId: this.props.match.params.id,
    //       userId: this.props.getUserLocal.user.id
    //     }
    //   });
    // } else {
    //   console.log("updating your vote");
    //   await this.props.updateVote({
    //     variables: {
    //       support,
    //       id: hasVoted.id
    //     }
    //   });
    // }
    // this.props.getRevision.refetch();
  };
  render() {
    const { revision, loading } = this.state;
    if (loading) {
      return (
        <div id="docs-wrapper" className="column-center">
          <Loader />
          <div className="f3 pb2 b mv4 tc">Fetching Revision</div>
        </div>
      );
    }
    console.log("wat");

    const { amendment, newText, votes, title } = revision;

    const support = votes.filter(({ support }) => support).length;
    const hasVoted = revision.votes.find(
      ({ user: id }) => id === this.props.user
    );
    if (amendment !== null) {
      /* Represents a change to existing legislation; Show diff panels   */
      return (
        <div id="revisions-wrapper">
          <Scrollbars style={{ height: "100%", width: "100%" }}>
            <RevisionHeader title={title} isNew={false} />

            {hasVoted && <HasVoted vote={hasVoted} />}
            <div className="bg-theme ma2 ma4-ns">
              <RevisionStatus {...revision} support={support} />
              <DiffSection {...revision} mode={this.state.mode} />
              <ToggleDiffBar mode={this.state.mode} toggle={this.toggleMode} />
              <RevisionStats {...revision} support={support} />
              {this.props.user && <VoteButtons vote={this.vote} />}{" "}
            </div>
          </Scrollbars>
        </div>
      );
    } else {
      /* Represents a new legislation without precedent; Show single panel */
      return (
        <div id="revisions-wrapper">
          <Scrollbars style={{ height: "100%", width: "100%" }}>
            <RevisionHeader title={title} isNew={true} />
            {hasVoted && <HasVoted vote={hasVoted} />}

            <div className="bg-theme ma4">
              <RevisionStatus {...revision} support={support} />
              <div className="pa3 white pre-wrap">{newText}</div>
              <RevisionStats {...revision} support={support} />
              {this.props.user && <VoteButtons vote={this.vote} />}{" "}
            </div>
          </Scrollbars>
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
    icon: "http://mrmrs.github.io/photos/p/2.jpg",
    id: "s9d87f6g9"
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
