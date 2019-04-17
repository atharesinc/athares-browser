import React, { Component, Fragment } from "react";
import { CREATE_RESET_REQUEST } from "../graphql/mutations";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import Loader from "../components/Loader";

class Forgot extends Component {
  state = {
    loading: false,
    email: ""
  };
  requestReset = async () => {
    await this.setState({ loading: true });
    let { email } = this.state;

    if (email.trim() !== "") {
      try {
        let token = Math.random()
          .toString(16)
          .replace(".", "")
          .substring(0, 8);
        let res = await this.props.createResetRequest({
          variables: {
            token,
            email
          }
        });

        let {
          data: {
            createResetRequest: { id }
          }
        } = res;

        this.setState({
          email: ""
        });

        this.props.history.push("/reset/" + id);
      } catch (err) {
        console.error(new Error(err));
        await this.setState({ loading: false });
        swal("Error", "Unable to send reset link.", "error");
      }
    }
  };
  updateInfo = e => {
    this.setState({
      email: e.currentTarget.value
    });
  };
  render() {
    const { email, loading } = this.state;
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
        {loading === false ? (
          <div className="w-100 w-50-l flex flex-column justify-around items-center">
            <p className="portal-text">
              Please enter your email to recover your account.
            </p>
            <div className="portal-input-wrapper mb3">
              <FeatherIcon className="portal-input-icon h1 w1" icon="at-sign" />
              <input
                placeholder="Email"
                className="portal-input h2 ghost pa2"
                required
                type="email"
                onChange={this.updateInfo}
                value={email}
                id="forgotEmail"
                tabIndex="1"
              />
            </div>
            <button
              id="forgot-button"
              className="f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer"
              tabIndex="2"
              onClick={this.requestReset}
            >
              REQUEST LINK
            </button>
          </div>
        ) : (
          <div className="w-100 w-50-l flex flex-column justify-around items-center">
            <Loader />
          </div>
        )}
      </Fragment>
    );
  }
}

export default withRouter(
  graphql(CREATE_RESET_REQUEST, { name: "createResetRequest" })(Forgot)
);
