import React, { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateCircle } from "../../../store/state/actions";
import Loader from "../../../components/Loader";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { DELETE_USER_FROM_CIRCLE } from "../../../graphql/mutations";
import { GET_CIRCLE_NAME_BY_ID } from "../../../graphql/queries";
import { graphql, Query } from "react-apollo";

class CreateChannel extends Component {
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }

  leaveCircle = e => {
    e.preventDefault();
    let { activeCircle } = this.props;

    swal("Are you sure you'd like to leave this Circle?", {
      buttons: {
        cancel: "Not yet",
        confirm: true
      }
    }).then(async value => {
      if (value === true) {
        this.props.deleteUserFomCircle({
          variables: {
            user: this.props.user,
            circle: this.props.activeCircle
          }
        });
        swal(
          "Removed From Circle",
          `You have left this Circle. You will have to be re-invited to participate at a later time.`,
          "warning"
        );
        this.props.dispatch(updateCircle(null));
        this.props.history.push(`/app`);
      }
    });
  };
  back = () => {
    this.props.history.push(`/app`);
  };
  render() {
    return (
      <Query
        query={GET_CIRCLE_NAME_BY_ID}
        variables={{ id: this.props.activeCircle }}
      >
        {({ loading, data: { Circle: circle } }) => {
          if (loading) {
            return (
              <div
                id="dashboard-wrapper"
                style={{ justifyContent: "center" }}
                className="pa2"
              >
                <Loader />
              </div>
            );
          }
          return (
            <div id="revisions-wrapper">
              <div className="flex ph2 mobile-nav">
                <Link to="/app" className="flex justify-center items-center">
                  <FeatherIcon
                    icon="chevron-left"
                    className="white db dn-l"
                    onClick={this.back}
                  />
                </Link>
                <h2 className="ma3 lh-title white"> Leave Circle </h2>
              </div>
              <div
                id="create-circle-form"
                className="pa2 pa4-ns white wrapper mobile-body"
              >
                <article className="mb3">
                  <time className="f7 ttu tracked white-80">
                    Leave the Circle {circle.name}
                  </time>
                </article>
                <div id="comment-desc" className="f6 white-80">
                  By pressing "Leave Circle" you are choosing to be removed from
                  participation in all circle communication, notifications,
                  channels, and revisions. You can still view all public
                  information about this circle, but you will not be able to use
                  it's channels, or cast votes in revision polls.
                  <br />
                  <br />
                  If you would like to return to this Circle at a later date,
                  you will need to be re-invited by someone inside the Circle.
                </div>

                <button
                  id="create-circle-button"
                  className="btn mt4"
                  onClick={this.leaveCircle}
                >
                  Leave Circle
                </button>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeCircle: pull(state, "activeCircle")
  };
}

export default graphql(DELETE_USER_FROM_CIRCLE, {
  name: "deleteUserFomCircle"
})(connect(mapStateToProps)(CreateChannel));
