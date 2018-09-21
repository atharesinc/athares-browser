import React from "react";
import CircleInviteList from "./CircleInviteList";
import { connect } from "react-redux";
import * as stateSelectors from "../../../store/state/reducers";
import { withGun } from "../../../utils/react-gun";

class addUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.push("/app");
    }
  }
  onSubmit = e => {
    e.preventDefault();

    // double check that all users in state are NOT currently in circle

    // add each user to circle

    // notification

    // clear state
    this.setState({
      users: []
    });
  };
  updateList = items => {
    this.setState({
      users: items
    });
  };
  render() {
    return (
      <div id="dashboard-wrapper">
        <form
          className="pa4 white wrapper"
          onSubmit={this.onSubmit}
          id="create-circle-form"
          style={{
            overflowY: "scroll"
          }}
        >
          <article className="cf">
            <h1 className="mb3 mt0 lh-title">Invite Users</h1>
            <time className="f7 ttu tracked white-60">
              Add existing users to participate in this circle
            </time>
            <div className="fn mt4">
              <div className="mb4 ba b--white-30" id="circle-invite-list">
                <CircleInviteList
                  updateList={this.updateList}
                  shouldPlaceholder={this.state.users.length === 0}
                />
              </div>
            </div>
          </article>
          <div id="comment-desc" className="f6 white-60">
            After pressing "Invite", the recipient(s) may be added automatically
            to this circle, depending on their privacy settings.
            <br />
            <br />
            Invitations are public information, but aren't subject to democratic
            process.
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
    user: stateSelectors.pull(state, "user")
  };
}

export default withGun(connect(mapStateToProps)(addUser));
