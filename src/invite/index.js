import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { GET_INVITE_BY_ID, GET_USER_BY_ID } from "../graphql/queries";
import {
  ADD_USER_TO_CIRCLE,
  CREATE_USER,
  UPDATE_INVITE
} from "../graphql/mutations";
import { compose, graphql } from "react-apollo";
import { pull } from "../store/state/reducers";
import Loader from "../components/Loader";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { logout } from "../store/state/actions";
import { Scrollbars } from "react-custom-scrollbars";
import MiniLoginRegister from "./MiniLoginRegister";

class Invite extends Component {
  state = {
    registered: false,
    loading: true
  };
  componentDidMount() {
    if (this.props.getInviteById.Invite) {
      if (this.props.getInviteById.Invite.hasAccepted) {
        this.props.history.replace("/app");
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.getInviteById.Invite !== prevProps.getInviteById.Invite) {
      if (this.props.getInviteById.Invite.hasAccepted) {
        this.props.history.replace("/app");
      }
      if (
        this.props.getUserById.User &&
        this.props.getUserById.User.id ===
          this.props.getInviteById.Invite.inviter.id
      ) {
        this.props.history.replace("/app");
      }
    }
  }
  logout = () => {
    this.props.dispatch(logout());
  };
  joinCircle = async () => {
    let { getInviteById, getUserById } = this.props;
    let circle,
      invite,
      user = null;

    if (getInviteById.Invite) {
      circle = getInviteById.Invite.circle;
      invite = getInviteById.Invite;
    }
    if (getUserById.User) {
      user = getUserById.User;
    }
    if (user && circle) {
      try {
        await this.props.addUserToCircle({
          variables: {
            circle: circle.id,
            user: user.id
          }
        });

        await this.props.updateInvite({
          variables: {
            id: invite.id
          }
        });

        this.props.history.replace("/app");
      } catch (err) {
        console.error(new Error(err));
        swal("Error", "An error occurred joining this Circle", "error");
      }
    }
  };
  render() {
    let { getInviteById, getUserById } = this.props;
    let circle,
      user,
      loading,
      invitingUser = null;

    if (getInviteById.loading || getUserById.loading) {
      loading = true;
    } else {
      loading = false;
    }
    if (getInviteById.Invite) {
      circle = getInviteById.Invite.circle;
      invitingUser = getInviteById.Invite.inviter;
    }
    if (getUserById.User) {
      user = getUserById.User;
    }
    if (circle && loading === false) {
      return (
        <div className="wrapper mt2">
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            universal={true}
            style={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <div className="invite-banner">
              <img
                src={circle.icon}
                alt=""
                style={{ fontWeight: 500 }}
                className="ba b--white bw2 br-100 ma2 mr4-ns"
              />
              <div
                style={{
                  display: "inline-block",
                  textAlign: "left",
                  lineHeight: "49px",
                  height: "49px"
                }}
              >
                <h2 className="ma0 pa0 f5 f4-ns white">
                  {invitingUser.firstName +
                    " " +
                    invitingUser.lastName +
                    " has invited you to " +
                    circle.name}
                </h2>
              </div>
            </div>
            {/* end top line */}
            <div className="w-100 tc mb3">
              {user ? (
                <button
                  id="create-circle-button"
                  className="btn mv4 springUp"
                  onClick={this.joinCircle}
                >
                  Join Circle
                </button>
              ) : (
                <MiniLoginRegister />
              )}
              {user && (
                <Fragment>
                  <div className="white-70 mb3 springUp">
                    Logged in as: {user.firstName}
                  </div>
                  <div className="white-70 glow springUp" onClick={this.logout}>
                    Not you?
                  </div>
                </Fragment>
              )}
            </div>
          </Scrollbars>
        </div>
      );
    }
    return (
      <div className="wrapper flex flex-column items-center justify-center">
        <Loader />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default withRouter(
  connect(mapStateToProps)(
    compose(
      graphql(GET_INVITE_BY_ID, {
        name: "getInviteById",
        options: ({ match }) => ({ variables: { id: match.params.id || "" } })
      }),
      graphql(GET_USER_BY_ID, {
        name: "getUserById",
        options: ({ user }) => ({ variables: { id: user || "" } })
      }),
      graphql(ADD_USER_TO_CIRCLE, { name: "addUserToCircle" }),
      graphql(UPDATE_INVITE, { name: "updateInvite" }),
      graphql(CREATE_USER, { name: "createUser" })
    )(Invite)
  )
);
