import React, { Component } from "react";
import ErrorSwap from "../../../utils/ErrorSwap";
import Loader from "../../../components/Loader";
import { withRouter, Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateRevision } from "../../../store/state/actions";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";

import { compose, graphql } from "react-apollo";
import { CREATE_REVISION, CREATE_VOTE } from "../../../graphql/mutations";
import { GET_AMENDMENTS_FROM_CIRCLE_ID } from "../../../graphql/queries";
import moment from "moment";

class CreateAmendment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      amendment: "",
      isTaken: false,
      loading: false
    };
  }
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }
  updateName = e => {
    this.setState({
      name: e.target.value.substring(0, 51)
    });
  };
  updateAmend = e => {
    this.setState({
      amendment: e.target.innerText
    });
  };
  // the longest a revision must persist before votes are counted is 7 days ( many users), the shortest is about 30 seconds (1 user)
  // add this number of seconds to the createdAt time to determine when a revision should expire, where x is the number of users
  customSigm = x => {
    return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
  };
  onSubmit = async e => {
    e.preventDefault();
    // validate & trim fields
    // ???
    await this.setState({ loading: true });
    let {
      data: { Circle: circle },
      user
    } = this.props;

    let numUsers = circle.users.length;
    try {
      let newRevision = {
        circle: this.props.activeCircle,
        user: this.props.user,
        title: this.state.name,
        newText: this.state.amendment.trim(),
        expires: moment()
          .add(Math.max(this.customSigm(numUsers), 61), "s")
          .format(),
        voterThreshold: Math.round(numUsers / 2)
      };

      let newRevisionRes = await this.props.createRevision({
        variables: {
          ...newRevision
        }
      });

      newRevision.id = newRevisionRes.data.createRevision.id;

      const newVote = {
        revision: newRevision.id,
        user: this.props.user,
        support: true
      };

      let newVoteRes = await this.props.createVote({
        variables: {
          ...newVote
        }
      });

      this.props.dispatch(updateRevision(newRevision.id));

      this.props.history.push(
        `/app/circle/${this.props.activeCircle}/revisions/${newRevision.id}`
      );
    } catch (err) {
      console.log(err);
      swal(
        "Error",
        "There was an error connecting to the Athares network. Please try again later.",
        "error"
      );
    }
  };
  clearError = () => {
    this.setState({
      isTaken: false
    });
  };
  render() {
    let { activeCircle, data } = this.props;

    if (activeCircle && data.Circle) {
      return (
        <div id="revisions-wrapper">
          <div className="flex db-ns ph2 h10">
            <Link to="/app" className="flex justify-center items-center">
              <FeatherIcon
                icon="chevron-left"
                className="white db dn-l"
                onClick={this.back}
              />
            </Link>
            <h2 className="ma3 lh-title white">Create Amendment</h2>
          </div>
          <Scrollbars style={{ height: "85vh", width: "100%" }}>
            <form
              className="pa2 pa4-ns white wrapper"
              onSubmit={this.onSubmit}
              id="create-circle-form"
            >
              <article className="cf">
                <time className="f7 ttu tracked white-80">
                  Draft a new piece of legislation for {activeCircle.name}
                </time>
                <div className="fn mt4">
                  <div className="measure mb4">
                    <label htmlFor="name" className="f6 b db mb2">
                      Name
                    </label>
                    <input
                      id="name"
                      className="input-reset ba pa2 mb2 db w-100 ghost"
                      type="text"
                      aria-describedby="name-desc"
                      required
                      value={this.state.name}
                      onChange={this.updateName}
                    />
                    <ErrorSwap
                      condition={!this.state.isTaken}
                      normal={
                        <small id="name-desc" className="f6 white-80 db mb2">
                          Provide a name for your new amendment.
                        </small>
                      }
                      error={
                        <small id="name-desc" className="f6 red db mb2">
                          Amendment must have a name
                        </small>
                      }
                    />
                  </div>
                  <div className="mv4">
                    <label htmlFor="comment" className="f6 b db mb2">
                      Amendment
                    </label>
                    <Scrollbars
                      style={{
                        maxHeight: "11.5rem",
                        width: "100%"
                      }}
                      autoHeight
                      className="ghost mb2"
                    >
                      <div
                        contentEditable={true}
                        className={`f6 amendment-text editableText`}
                        onInput={this.updateAmend}
                        value={this.state.amendment}
                        suppressContentEditableWarning
                      />
                    </Scrollbars>
                    <ErrorSwap
                      condition={!this.state.isTaken}
                      normal={
                        <small id="comment-desc" className="f6 white-80">
                          Draft your amendment. What do you want to add to your
                          government?
                        </small>
                      }
                      error={
                        <small id="name-desc" className="f6 red db mb2">
                          You can't submit an empty amendment.
                        </small>
                      }
                    />
                  </div>
                </div>
              </article>
              <div id="comment-desc" className="f6 white-80">
                Pressing "Draft Amendment" will create a new revision for this
                amendment. Drafts must first be ratified by a minimum electorate
                of Circle members, and then must be approved with a majority of
                votes. Amendment drafts are publicly accessible, but can be
                removed by the owner at any point before ratification.
              </div>
              <button
                id="create-circle-button"
                className="btn mt4"
                type="submit"
              >
                Draft Amendment
              </button>
            </form>
          </Scrollbars>
        </div>
      );
    } else {
      return (
        <div
          id="dashboard-wrapper"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Loader />
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
export default connect(mapStateToProps)(
  compose(
    graphql(CREATE_REVISION, { name: "createRevision" }),
    graphql(CREATE_VOTE, { name: "createVote" }),
    graphql(GET_AMENDMENTS_FROM_CIRCLE_ID, {
      options: ({ activeCircle }) => ({
        variables: {
          id: activeCircle
        }
      })
    })
  )(withRouter(CreateAmendment))
);
