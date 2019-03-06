import React, { Component } from "react";
import CircleInviteList from "./CircleInviteList";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateCircle } from "../../../store/state/actions";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import {
  ADD_USER_TO_CIRCLE,
  CREATE_CIRCLE_PERMISSION
} from "../../../graphql/mutations";

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUsers: []
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user && !this.props.user) {
      this.props.history.replace("/app");
    }
  }
  componentDidMount() {
    if (!this.props.user) {
      this.props.history.replace("/app");
    }
    if (
      !this.props.activeCircle ||
      this.props.activeCircle !== this.props.match.params.id
    ) {
      this.props.dispatch(updateCircle(this.props.match.params.id));
    }
  }

  updateList = items => {
    this.setState({
      selectedUsers: items
    });
  };
  onSubmit = async e => {
    e.preventDefault();
    // add each user to circle
    let { selectedUsers } = this.state;
    if (selectedUsers.length === 0) {
      return;
    }
    try {
      let invites = selectedUsers.map(user => {
        return this.props.addUserToCircle({
          variables: {
            user: user.id,
            circle: this.props.activeCircle
          }
        });
      });

      let newPermissions = selectedUsers.map(user => {
        return this.props.createCirclePerm({
          variables: {
            user: user.id,
            circle: this.props.activeCircle
          }
        });
      });
      await Promise.all(newPermissions);
      Promise.all(invites).then(() => {
        swal(
          `${selectedUsers.length > 1 ? "Users Added" : "User Added"}`,
          `${
            selectedUsers.length > 1 ? "These users have" : "This user has"
          } been added.`,
          "success"
        );
        this.props.history.push("/app");
        // clear state
        this.setState({
          users: []
        });
      });
    } catch (err) {
      console.error(new Error(e));
      swal("Error", "There was an error inviting users.", "error");
    }
  };
  render() {
    const { selectedUsers } = this.state;
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
          <h2 className="ma3 lh-title white"> Invite Users </h2>
        </div>
        <form
          className="pa4 white wrapper mobile-body"
          onSubmit={this.onSubmit}
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
                  shouldPlaceholder={this.state.selectedUsers.length === 0}
                  updateList={this.updateList}
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
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    pub: pull(state, "pub"),
    activeCircle: pull(state, "activeCircle")
  };
}

export default connect(mapStateToProps)(
  compose(
    graphql(ADD_USER_TO_CIRCLE, { name: "addUserToCircle" }),
    graphql(CREATE_CIRCLE_PERMISSION, { name: "createCirclePerm" })
  )(AddUser)
);
