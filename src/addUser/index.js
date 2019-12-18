import React, { useState } from "reactn";
import CircleInviteList from "./CircleInviteList";

import { pull } from "../store/state/reducers";
import { updateCircle } from "../store/state/actions";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";
import compose from 'lodash.flowright'
import { ADD_USER_TO_CIRCLE } from "../graphql/mutations";

function AddUser (){
 
     const [selectedUsers, setSelectedUsers] = useState([])

  componentDidUpdate(prevProps) {
    if (prevProps.user !== props.user && !props.user) {
      props.history.replace("/app");
    }
  }
useEffect(()=>{
 componentMount();
}, [])

const componentMount =    => {
    if (!props.user) {
      props.history.replace("/app");
    }
    if (
      !props.activeCircle ||
      props.activeCircle !== props.match.params.id
    ) {
      props.dispatch(updateCircle(props.match.params.id));
    }
  }

  const updateList = items => {
   setSelectedUsers( items)
  };

  const onSubmit = async e => {
    e.preventDefault();
    // add each user to circle
    let { selectedUsers } = state;
    if (selectedUsers.length === 0) {
      return;
    }
    try {
      let invites = selectedUsers.map(user => {
        return props.addUserToCircle({
          variables: {
            user: user.id,
            circle: props.activeCircle
          }
        });
      });

      Promise.all(invites).then(() => {
        swal(
          `${selectedUsers.length > 1 ? "Users Added" : "User Added"}`,
          `${
            selectedUsers.length > 1 ? "These users have" : "This user has"
          } been added.`,
          "success"
        );
        props.history.push("/app");
        // clear state
        setSelectedUsers([])
      });
    } catch (err) {
      console.error(new Error(e));
      swal("Error", "There was an error inviting users.", "error");
    }
  };
  
    const { selectedUsers } = state;
    return (
      <div id="revisions-wrapper">
        <div className="flex ph2 mobile-nav">
          <Link to="/app" className="flex justify-center items-center">
            <FeatherIcon
              icon="chevron-left"
              className="white db dn-l"
              onClick={back}
            />
          </Link>
          <h2 className="ma3 lh-title white"> Invite Users </h2>
        </div>
        <form
          className="pa4 white wrapper mobile-body"
          onSubmit={onSubmit}
          id="create-circle-form"
          style={{
            overflowY: "scroll"
          }}
        >
          <article className="cf">
            <time className="f7 ttu tracked white-60">
              Add existing users to participate in this circle
            </time>
            <div className="fn mt4">
              <div className="mb4 ba b--white-30" id="circle-invite-list">
                <CircleInviteList
                  shouldPlaceholder={state.selectedUsers.length === 0}
                  updateList={updateList}
                  selectedUsers={selectedUsers}
                />
              </div>
            </div>
          </article>
          <div id="comment-desc" className="f6 white-60">
            After pressing "Invite Users", the recipient(s) will be added
            automatically to this circle.
            <br />
            <br />
            Invitations aren't subject to democratic process.
          </div>
          <button id="create-circle-button" className="btn mt4" type="submit">
            Invite Users
          </button>
        </form>
      </div>
    );
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    pub: pull(state, "pub"),
    activeCircle: pull(state, "activeCircle")
  };
}

export default connect(mapStateToProps)(
  compose(graphql(ADD_USER_TO_CIRCLE, { name: "addUserToCircle" }))(AddUser)
);
