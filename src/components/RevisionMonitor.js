import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";
import moment from "moment";
import {
  CREATE_AMENDMENT_FROM_REVISION,
  DENY_REVISION,
  UPDATE_AMENDMENT_FROM_REVISION
} from "../graphql/mutations";
import { GET_ACTIVE_REVISIONS_BY_USER_ID } from "../graphql/queries";
import { compose, graphql } from "react-apollo";

let checkItemsTimer = null;

class App extends Component {
  constructor() {
    super();
    this.checkItemsTimer = checkItemsTimer;
  }
  async componentDidUpdate(prevProps) {
    // only do the following if revisions are loaded, not before
    if (this.props.data.User) {
      // get a flat list of revisions for current and past props
      let allRevisions = this.getAllRevisions();
      let prevRevisions = prevProps.data.User
        ? prevProps.data.User.circles
            .map(c => c.revisions.map(r => ({ ...r, circle: c.id })))
            .flat(1)
        : [];
      if (allRevisions.length !== prevRevisions.length) {
        // There is probably a new revision or the last revision has been dealt with
        // Reset Timer
        this.getNext();
      }
    }
  }
  getAllRevisions = () => {
    return this.props.data.User.circles
      .map(c => c.revisions.map(r => ({ ...r, circle: c.id })))
      .flat(1);
  };
  getNext = () => {
    clearTimeout(this.checkItemsTimer);
    let now = moment().valueOf();
    if (!this.props.data.User) {
      return false;
    }
    let revisions = this.getAllRevisions();

    let items = revisions
      .filter(i => i.passed === null)
      .sort(
        (a, b) => moment(a.expires).valueOf() - moment(b.expires).valueOf()
      );
    if (items.length === 0) {
      return;
    }
    // find soonest ending item, see if it has expired
    for (let i = 0, j = items.length; i < j; i++) {
      if (moment(items[i].expires).valueOf() <= now) {
        // process this item

        this.checkIfPass({
          circleId: items[i].circle,
          revisionId: items[i].id
        });
        break;
      } else if (moment(items[i].expires).valueOf() > now) {
        // there aren't any revisions that need to be processed, set a timer for the soonest occurring one
        let time = moment(items[i].expires).valueOf() - now;

        this.checkItemsTimer = setTimeout(this.getNext, time);
        break;
      }
    }
    return;
  };

  // a revision has expired or crossed the voter threshold
  // see if it has passed and becomes an amendment or fails and lives in infamy
  checkIfPass = async ({ circleId, revisionId }) => {
    let revisions = this.getAllRevisions();

    let thisRevision = revisions.find(r => r.id === revisionId);
    // get the votes for this revision in this circle
    let { votes } = thisRevision;

    let supportVotes = votes.filter(v => v.support === true);
    // // it passes because the majority of votes has been reached after the expiry period
    // OR enough people have voted before the expiration that the remaining voters couldn't over turn the vote
    // but this doesn't seem fair and won't come up logically, I think...
    if (
      (supportVotes.length > votes.length / 2 &&
        moment().valueOf() >= moment(thisRevision.expires).valueOf()) ||
      supportVotes.length >= thisRevision.voterThreshold
    ) {
      if (thisRevision.amendment) {
        await this.props.updateAmendment({
          variables: {
            amendment: thisRevision.amendment.id,
            title: thisRevision.title,
            text: thisRevision.newText,
            revision: thisRevision.id,
            circle: thisRevision.circle
          }
        });
        this.getNext();
      } else {
        await this.props.createAmendmentFromRevision({
          variables: {
            title: thisRevision.title,
            text: thisRevision.newText,
            revision: thisRevision.id,
            circle: thisRevision.circle
          }
        });
        this.getNext();
      }
    } else {
      // it fails and we ignore it forever
      await this.props.denyRevision({
        variables: {
          id: thisRevision.id
        }
      });
      this.getNext();
    }
  };
  render() {
    return null;
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(UPDATE_AMENDMENT_FROM_REVISION, { name: "updateAmendment" }),
    graphql(CREATE_AMENDMENT_FROM_REVISION, {
      name: "createAmendmentFromRevision"
    }),
    graphql(DENY_REVISION, {
      name: "denyRevision"
    }),
    graphql(GET_ACTIVE_REVISIONS_BY_USER_ID, {
      options: ({ user }) => ({
        variables: { id: user || "" },
        pollInterval: 10000
      })
    })
  )(withRouter(App))
);