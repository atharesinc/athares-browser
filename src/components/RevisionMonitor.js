import { Component, withGlobal } from "reactn";
import { withRouter } from "react-router-dom";
import { unixTime } from "../utils/transform";
import {
  CREATE_AMENDMENT_FROM_REVISION,
  DENY_REVISION,
  UPDATE_AMENDMENT_FROM_REVISION,
  UPDATE_AMENDMENT_FROM_REVISION_AND_DELETE
} from "../graphql/mutations";
import { GET_ACTIVE_REVISIONS_BY_USER_ID } from "../graphql/queries";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import sha from "simple-hash-browser";

let checkItemsTimer = null;

class RevisionMonitor extends Component {
  constructor() {
    super();
    this.checkItemsTimer = checkItemsTimer;
  }
  componentDidUpdate(prevProps) {
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
    let now = unixTime();
    if (!this.props.data.User) {
      return false;
    }
    let revisions = this.getAllRevisions();

    let items = revisions
      .filter(i => i.passed === null)
      .sort((a, b) => unixTime(a.expires) - unixTime(b.expires));
    if (items.length === 0) {
      return;
    }
    // find soonest ending item, see if it has expired
    for (let i = 0, j = items.length; i < j; i++) {
      if (unixTime(items[i].expires) <= now) {
        // process this item

        this.checkIfPass({
          circleId: items[i].circle,
          revisionId: items[i].id
        });
        break;
      } else if (unixTime(items[i].expires) > now) {
        // there aren't any revisions that need to be processed, set a timer for the soonest occurring one
        let time = unixTime(items[i].expires) - now;

        this.checkItemsTimer = setTimeout(this.getNext, time);
        break;
      }
    }
    return;
  };

  // a revision has expired or crossed the voter threshold
  // see if it has passed and becomes an amendment or fails and lives in infamy
  checkIfPass = async ({ circleId, revisionId }) => {
    try {
      let revisions = this.getAllRevisions();
      let thisRevision = revisions.find(r => r.id === revisionId);
      // get the votes for this revision in this circle
      let { votes } = thisRevision;

      let supportVotes = votes.filter(v => v.support === true);
      // // it passes because the majority of votes has been reached after the expiry period
      // AND enough people have voted to be representative of the population for a fair referendum

      if (
        supportVotes.length > votes.length / 2 &&
        unixTime() >= unixTime(thisRevision.expires) &&
        votes.length >= thisRevision.voterThreshold
      ) {
        // if this revision is a repeal, update the revision like in updateAmendment but also delete amendment
        if (thisRevision.repeal === true) {
          await this.props.deleteAmendment({
            variables: {
              revision: thisRevision.id,
              amendment: thisRevision.amendment.id
            }
          });
          this.getNext();
        } else {
          // create a separate unique identifier to make sure our new amendment doesn't get created twice

          let hash = await sha(
            JSON.stringify({
              id: thisRevision.id,
              title: thisRevision.title,
              text: thisRevision.newText
            })
          );
          if (thisRevision.amendment) {
            await this.props.updateAmendment({
              variables: {
                amendment: thisRevision.amendment.id,
                title: thisRevision.title,
                text: thisRevision.newText,
                revision: thisRevision.id,
                circle: thisRevision.circle,
                hash
              }
            });
            this.getNext();
          } else {
            await this.props.createAmendmentFromRevision({
              variables: {
                title: thisRevision.title,
                text: thisRevision.newText,
                revision: thisRevision.id,
                circle: thisRevision.circle,
                hash
              }
            });
            this.getNext();
          }
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
    } catch (e) {
      if (e.message.includes("'Amendment' has no item with id")) {
        return;
      }
      console.error(e);
    }
  };
  render() {
    return null;
  }
}
export default withGlobal(({ user }) => ({ user }))(
  compose(
    graphql(UPDATE_AMENDMENT_FROM_REVISION_AND_DELETE, {
      name: "deleteAmendment"
    }),
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
  )(withRouter(RevisionMonitor))
);
