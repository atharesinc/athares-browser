import React, { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import Loader from "../../../components/Loader";
import FeatherIcon from "feather-icons-react";
import { CREATE_INVITE } from "../../../graphql/mutations";
import { GET_CIRCLE_NAME_BY_ID } from "../../../graphql/queries";
import { graphql, Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";

let urlBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/invite/"
    : "https://athares.us/invite/";
class ShareCircle extends Component {
  state = {
    loading: false,
    link: null
  };
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }

  generateLink = async () => {
    let { user, activeCircle } = this.props;
    await this.setState({
      loading: true,
      link: null
    });

    try {
      let link = await this.props.createInvite({
        variables: {
          inviter: user,
          circle: activeCircle
        }
      });

      let { id } = link.data.createInvite;

      this.setState({
        link: id,
        loading: false
      });
    } catch (err) {
      console.error(new Error(err));
      this.setState({
        loading: false
      });
      swal("Error", "Unable to generate invite link.", "error");
    }
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
              <div className="w-100 flex justify-center items-center">
                <Loader />
              </div>
            );
          }
          return (
            <div className="pa2 bb b--white-70">
              <article className="mb3">
                <time className="f4 lh-title white">Share Circle</time>
              </article>
              <div id="comment-desc" className="f6 white-80">
                Invite someone to {circle.name} with a single-use link.
                Prospective users will have the option to sign up if they don't
                have an Athares account.
              </div>

              {!this.state.loading ? (
                <button
                  id="create-circle-button"
                  className="btn mt4"
                  onClick={this.generateLink}
                >
                  {this.state.link ? "Create New Link" : "Generate Link"}
                </button>
              ) : (
                <FeatherIcon className="spin white mt4" icon="loader" />
              )}
              {this.state.link && (
                <pre
                  className="springUp ba b--white-70 pa3"
                  style={{ maxWidth: "100%", overflowX: "scroll" }}
                >
                  {urlBase + this.state.link}
                </pre>
              )}
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

export default graphql(CREATE_INVITE, {
  name: "createInvite"
})(connect(mapStateToProps)(withRouter(ShareCircle)));
