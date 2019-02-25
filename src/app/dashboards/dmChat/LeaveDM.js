import React, { Component } from "react";
import swal from "sweetalert";
import { graphql, compose } from "react-apollo";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateChannel } from "../../../store/state/actions";
import {
  DELETE_USER_FROM_DM,
  DELETE_USER_KEY
} from "../../../graphql/mutations";
import { closeDMSettings } from "../../../store/ui/actions";
import { withRouter } from "react-router-dom";

class LeaveDM extends Component {
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
          console.log(res);
          let { id } = res.data.removeFromUsersOnChannels.usersUser.keys[0];

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
  render() {
    return (
      <div className="pa3 ba b--red">
        <article className="mb3">
          <time className="f5 lh-copy white">Leave Channel</time>
        </article>
        <div id="comment-desc" className="f6 white-80">
          By pressing "Leave Channel" you will be removed from this channel, and
          any messages or files you shared will not be accessible by you.
          <br />
          If you would like to return to this channel at a later date, you will
          need to be re-invited by someone inside the channel.
        </div>

        <button
          id="create-circle-button"
          className="btn-red mt4"
          onClick={this.leave}
        >
          Leave Channel
        </button>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeChannel: pull(state, "activeChannel")
  };
}
export default withRouter(
  connect(mapStateToProps)(
    compose(
      graphql(DELETE_USER_FROM_DM, { name: "deleteUserFromDM" }),
      graphql(DELETE_USER_KEY, { name: "deleteUserKey" })
    )(LeaveDM)
  )
);
