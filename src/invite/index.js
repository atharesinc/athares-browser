import React, { Fragment, useEffect, withGlobal, useGlobal } from "reactn";
import { GET_INVITE_BY_ID, GET_USER_BY_ID } from "../graphql/queries";
import {
  ADD_USER_TO_CIRCLE,
  CREATE_USER,
  UPDATE_INVITE
} from "../graphql/mutations";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import Loader from "../components/Loader";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import { Scrollbars } from "react-custom-scrollbars";
import MiniLoginRegister from "./MiniLoginRegister";
import { logout } from "../utils/state";

function Invite(props) {
  const [loading] = useGlobal("loading");

  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = () => {
    if (props.getInviteById.Invite) {
      if (props.getInviteById.Invite.hasAccepted) {
        props.history.replace("/app");
      }
    }
  };
  useEffect(() => {
    if (props.getInviteById.Invite.hasAccepted) {
      props.history.replace("/app");
    }
    if (
      props.getUserById.User &&
      props.getUserById.User.id === props.getInviteById.Invite.inviter.id
    ) {
      props.history.replace("/app");
    }
  }, [props.getInviteById.Invite]);

  const joinCircle = async () => {
    let { getInviteById, getUserById } = props;
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
        await props.addUserToCircle({
          variables: {
            circle: circle.id,
            user: user.id
          }
        });

        await props.updateInvite({
          variables: {
            id: invite.id
          }
        });

        props.history.replace("/app");
      } catch (err) {
        console.error(new Error(err));
        swal("Error", "An error occurred joining this Circle", "error");
      }
    }
  };

  let { getInviteById, getUserById } = props;
  let circle,
    user,
    loadingLocal,
    invitingUser = null;

  if (getInviteById.loading || getUserById.loading) {
    loadingLocal = true;
  } else {
    loadingLocal = false;
  }
  if (getInviteById.Invite) {
    circle = getInviteById.Invite.circle;
    invitingUser = getInviteById.Invite.inviter;
  }
  if (getUserById.User) {
    user = getUserById.User;
  }
  if (circle && loadingLocal === false && loading == false) {
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
                onClick={joinCircle}
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
                <div className="white-70 glow springUp" onClick={logout}>
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

export default withRouter(
  withGlobal(({ user }) => ({ user }))(
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
