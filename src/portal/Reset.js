import React, { Component, Fragment } from "react";
import {
  UPDATE_USER_PASSWORD,
  DELETE_RESET_REQUEST
} from "../graphql/mutations";
import { GET_RESET_REQUEST, GET_USER_BY_EMAIL } from "../graphql/queries";
import moment from "moment";
import { graphql } from "react-apollo";
import compose from 'lodash.flowright'
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import sha from "simple-hash-browser";
import Loader from "../components/Loader";

class Reset extends Component {
  state = {
    loading: false,
    code: "",
    password: "",
    showReset: false
  };

  checkIfExpired = () => {
    if (
      !this.props.data.ResetRequest ||
      moment(this.props.data.ResetRequest.createdAt)
        .add(24, "hours")
        .format() <= moment().format()
    ) {
      swal("Error", "This code is invalid or has expired.", "error");
      return false;
    }
    return true;
  };
  check = async () => {
    let valid = this.checkIfExpired();
    if (valid === false) {
      return false;
    }
    let { code } = this.state;
    code = code.trim().toLowerCase();

    let { token, id } = this.props.data.ResetRequest;
    if (id !== this.props.match.params.id) {
      console.log("uhh...");
      return false;
    }
    if (code === "") {
      return false;
    }
    if ((await sha(code)) !== token) {
      return false;
    }
    this.setState({
      showReset: true
    });
  };
  resetPassword = async () => {
    await this.setState({
      loading: true
    });
    let { password, code } = this.state;
    const { id, token } = this.props.data.ResetRequest;
    const { User } = this.props.getUser;

    if (id !== this.props.match.params.id) {
      return false;
    }
    code = code.trim().toLowerCase();

    if ((await sha(code)) !== token) {
      return false;
    }
    if (password.trim() === "") {
      swal("Error", "Password cannot be blank", "error");
      return false;
    }
    try {
      let hashedPass = await sha(password);
      await this.props.updateUserPassword({
        variables: {
          user: User.id,
          password: hashedPass
        }
      });
      await this.props.deleteResetRequest({
        variables: {
          id
        }
      });
      if (localStorage.getItem("ATHARES_HASH")) {
        localStorage.setItem("ATHARES_HASH", hashedPass);
      }
      this.props.history.push("/login");
      await this.setState({
        loading: false
      });
    } catch (err) {
      console.error(new Error(err));
      swal("Error", "Unable to update password at this time.", "error");
      await this.setState({
        loading: false
      });
    }
  };
  updateCode = e => {
    this.setState({
      code: e.currentTarget.value.toUpperCase()
    });
  };
  updatePassword = e => {
    this.setState({
      password: e.currentTarget.value
    });
  };
  render() {
    const { code, showReset, password, loading } = this.state;
    return (
      <Fragment>
        <div id="portal-header">
          <img
            src="/img/Athares-owl-logo-large-white.png"
            id="portal-logo"
            alt="logo"
          />
          <img
            src="/img/Athares-type-small-white.png"
            id="portal-brand"
            alt="brand"
          />
        </div>

        {loading ? (
          <div className="w-100 w-50-l flex flex-column justify-around items-center">
            <Loader />
          </div>
        ) : showReset === false ? (
          <Fragment>
            <div className="w-100 w-50-l flex flex-column justify-around items-center">
              <p className="portal-text">
                Enter the code sent to your email address.
              </p>
              <div className="portal-input-wrapper mb3">
                <FeatherIcon className="portal-input-icon h1 w1" icon="link" />
                <input
                  placeholder="Code"
                  className="portal-input h2 ghost pa2"
                  required
                  type="text"
                  onChange={this.updateCode}
                  value={code}
                  id="recoverCode"
                  tabIndex="1"
                />
              </div>
              <button
                id="forgot-button"
                className="f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer"
                tabIndex="2"
                onClick={this.check}
              >
                VERIFY CODE
              </button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="w-100 w-50-l flex flex-column justify-around items-center">
              <p className="portal-text">
                Enter a new password for this account.
              </p>
              <div className="portal-input-wrapper mb3">
                <FeatherIcon className="portal-input-icon h1 w1" icon="lock" />
                <input
                  placeholder="New Password"
                  className="portal-input h2 ghost pa2"
                  required
                  type="password"
                  onChange={this.updatePassword}
                  value={password}
                  id="newPassword"
                  tabIndex="1"
                />
              </div>
              <button
                className="f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer"
                tabIndex="2"
                onClick={this.resetPassword}
              >
                RESET PASSWORD
              </button>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default withRouter(
  compose(
    graphql(UPDATE_USER_PASSWORD, { name: "updateUserPassword" }),
    graphql(DELETE_RESET_REQUEST, { name: "deleteResetRequest" }),
    graphql(GET_RESET_REQUEST, {
      options: ({ match }) => ({ variables: { id: match.params.id || "" } })
    }),
    graphql(GET_USER_BY_EMAIL, {
      name: "getUser",
      options: ({ data }) => ({
        variables: { email: data.ResetRequest ? data.ResetRequest.email : "" }
      })
    })
  )(Reset)
);
