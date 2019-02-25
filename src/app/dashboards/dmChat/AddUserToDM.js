import React, { Component, Fragment } from "react";
import swal from "sweetalert";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateChannel } from "../../../store/state/actions";
import { closeDMSettings, toggleAddUsers } from "../../../store/ui/actions";
import FeatherIcon from "feather-icons-react";
import AddMoreUsers from "./AddMoreUsers";
import { GET_USERS_BY_CHANNEL_ID } from "../../../graphql/queries";

const pullUI = require("../../../store/ui/reducers").pull;

class AddUserToDM extends Component {
  constructor() {
    super();

    this.state = {
      selectedUsers: []
    };
  }
  leave = () => {
    let { activeChannel, user } = this.props;

    try {
      swal("Are you sure you'd like to leave this Channel?", {
        buttons: {
          cancel: "Not yet",
          confirm: true
        }
      }).then(async value => {
        if (value === true) {
          let res = await this.props.deleteUserFromDM({
            variables: {
              user,
              channel: activeChannel
            }
          });
          let { id } = res.data.deleteUserFromDM.usersUser.keys[0];

          await this.props.deleteUserKey({
            variables: {
              id
            }
          });

          swal(
            "Removed From Channel",
            `You have left this channel. You will have to be re-invited to participate at a later time.`,
            "warning"
          );
          this.props.dispatch(updateChannel(null));
          this.props.dispatch(closeDMSettings());
          this.props.history.push(`/app`);
        }
      });
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "There was an error leaving this channel.", "error");
    }
  };
  updateList = selectedUsers => {
    this.setState({
      selectedUsers
    });
  };
  submit = () => {
    console.log(this.props.selectedUsers);
    // hoo boy theres a lot to do here
    // get the users encrypted priv key
    // decrypt with stored token
    // decrypt this user's channel key
    // for each new user, encrypt the sym key
    // add connection from new user to channel
    // add each users key
  };
  toggleUserInput = () => {
    this.props.dispatch(toggleAddUsers());
  };
  render() {
    let users = [];
    console.log(this.props);
    if (this.props.getUsers.Channel) {
      users = this.props.getUsers.Channel.users;
    }
    return (
      <Fragment>
        <div
          className="flex items-center lh-copy ph0 h3 bb b--white-10 dim pointer"
          onClick={this.toggleUserInput}
        >
          <div className="pl3 flex-auto" to="about">
            <span className="f5 db white">Add Users</span>
            {users.length >= 6 && (
              <span className="f6 white-50">You can't add any more users</span>
            )}
          </div>
          <FeatherIcon
            className="w2 h2 w3-ns h3-ns pa3-ns pa0"
            icon="user-plus"
          />
        </div>
        {this.props.showAddMoreUsers && (
          <div className="flex flex-row justify-between items-start">
            <AddMoreUsers
              selectedUsers={this.state.selectedUsers || []}
              existingUsers={users || []}
              updateList={this.updateList}
            />
            <FeatherIcon icon="add" onClick={this.submit} />
          </div>
        )}
      </Fragment>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel"),
    showAddMoreUsers: pullUI(state, "showAddMoreUsers")
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(GET_USERS_BY_CHANNEL_ID, {
      name: "getUsers",
      options: ({ activeChannel }) => ({
        variables: { id: activeChannel || "" }
      })
    })
  )(AddUserToDM)
);
