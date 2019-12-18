import React, { Component } from "react";
import Loader from "../components/Loader";
import {
  UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE,
  UPDATE_REVISION_PERMISSION_FOR_CIRCLE,
  UPDATE_EMAIL_PERMISSION_FOR_CIRCLE,
  UPDATE_PUSH_PERMISSION_FOR_CIRCLE,
  UPDATE_SMS_PERMISSION_FOR_CIRCLE
} from "../graphql/mutations";
import { GET_CIRCLE_PREFS_FOR_USER } from "../graphql/queries";
import {  graphql } from "react-apollo";
import compose from 'lodash.flowright';
import Switch from "react-switch";
import { withRouter } from "react-router-dom";

class CirclePrefs extends Component {
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }

  updateAmendmentPref = async checked => {
    let { id } = this.props.data.User.circlePermissions[0];

    await this.props.updateAmendmentPref({
      variables: {
        id,
        flag: checked
      }
    });
  };
  updateRevisionPref = async checked => {
    let { id } = this.props.data.User.circlePermissions[0];

    await this.props.updateRevisionPref({
      variables: {
        id,
        flag: checked
      }
    });
  };
  updateEmailPref = async checked => {
    let { id } = this.props.data.User.circlePermissions[0];
    await this.props.updateEmailPref({
      variables: {
        id,
        flag: checked
      }
    });
  };

  render() {
    let {
      loading,
      data: { User: user }
    } = this.props;

    if (loading || !user) {
      return (
        <div className="w-100 flex justify-center items-center">
          <Loader />
        </div>
      );
    }
    let perm = user.circlePermissions[0];
    return (
      <div className="mv3 pa2">
        <article className="mb3">
          <time className="f4 lh-title white">Notification Preferences</time>
        </article>
        <div id="comment-desc" className="f6 white-80">
          Set your communication preferences for this Circle. By default you
          will receive an email notification when a new revision is created, and
          when a revision has passed or been rejected.
        </div>
        {/* dont send me emails */}
        <div className="mt3 mb2">
          <label
            htmlFor="allowEmail"
            className="flex flex-row justify-between items center"
          >
            <div>Allow email notifications</div>
            <Switch
              height={23}
              onChange={this.updateEmailPref}
              checked={perm.useEmail}
              uncheckedIcon={false}
              checkedIcon={false}
              onColor={"#00DFFC"}
              id="allowEmail"
            />
          </label>
        </div>
        {perm.useEmail && (
          <div className="openDown">
            <div className="mv2 ml3">
              <label
                htmlFor="allowEmailRevisions"
                className="flex flex-row justify-between items center"
              >
                <div className="f6">New Revisions</div>
                <Switch
                  height={23}
                  onChange={this.updateRevisionPref}
                  checked={perm.revisions}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onColor={"#00DFFC"}
                  id="allowEmailRevisions"
                />
              </label>
            </div>
            <div className="mv2 ml3">
              <label
                htmlFor="allowEmailAmendments"
                className="flex flex-row justify-between items center"
              >
                <div className="f6">New Amendments</div>
                <Switch
                  height={23}
                  onChange={this.updateAmendmentPref}
                  checked={perm.amendments}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onColor={"#00DFFC"}
                  id="allowEmailAmendments"
                />
              </label>
            </div>
          </div>
        )}
        {/*  */}
      </div>
    );
  }
}

export default compose(
  graphql(UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE, {
    name: "updateAmendmentPref"
  }),
  graphql(UPDATE_REVISION_PERMISSION_FOR_CIRCLE, {
    name: "updateRevisionPref"
  }),
  graphql(UPDATE_EMAIL_PERMISSION_FOR_CIRCLE, { name: "updateEmailPref" }),
  graphql(UPDATE_PUSH_PERMISSION_FOR_CIRCLE, { name: "updatePushPref" }),
  graphql(UPDATE_SMS_PERMISSION_FOR_CIRCLE, { name: "updateSMSPref" }),
  graphql(GET_CIRCLE_PREFS_FOR_USER, {
    options: ({ user, activeCircle }) => ({
      variables: { user: user || "", circle: activeCircle || "" }
    })
  })
)(withRouter(CirclePrefs));
