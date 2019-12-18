import React, { useState } from "reactn";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";
import { Link, withRouter } from "react-router-dom";
import { updateUser, updatePub } from "../store/state/actions";
import { validateLogin } from "../utils/validators";
import { pull } from "../store/state/reducers";

import { showLoading, hideLoading } from "react-redux-loading-bar";
import sha from "simple-hash-browser";
import { SIGNIN_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";

function MiniLogin (){
  
    this.state = {
      password: "",
      email: "",
      loading: false
    };
  
  const tryLogin = async e => {
    props.dispatch(showLoading());
    e.preventDefault();
    await this.setState({ loading: true });
    const isValid = validateLogin({ ...this.state });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      props.dispatch(hideLoading());
      await this.setState({ loading: false });
      return false;
    }
    const { signinUser } = props;
    let { password, email } = this.state;
    let hashedToken = await sha(password);

    try {
      const res = await signinUser({
        variables: {
          email,
          password: hashedToken
        }
      });

      const {
        data: {
          signinUser: { token, userId }
        }
      } = res;

      //store in redux
      window.localStorage.setItem("ATHARES_ALIAS", email);
      window.localStorage.setItem("ATHARES_HASH", hashedToken);
      window.localStorage.setItem("ATHARES_TOKEN", token);
      props.dispatch(updateUser(userId));
      props.dispatch(updatePub(hashedToken));
      props.dispatch(hideLoading());
      await this.setState({ loading: false });
    } catch (err) {
      if (err.message.indexOf("Invalid Credentials") !== -1) {
        swal("Error", "Invalid Credentials", "error");
      } else {
        swal("Error", err.message, "error");
      }
      props.dispatch(hideLoading());
      await this.setState({ loading: false });
    }
  };
  const updateInfo = () => {
    this.setState({
      password: document.getElementById("loginPassword").value,
      email: document.getElementById("loginEmail").value
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }
  
    const { email, password } = this.state;

    return (
      <form
        id="portal-login"
        className="wrapper w-100 slideInFromRight"
        onSubmit={this.tryLogin}
      >
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="at-sign" />
          <input
            placeholder="Email"
            className="portal-input h2 ghost pa2 mv2"
            required
            type="email"
            onChange={this.updateInfo}
            value={email}
            id="loginEmail"
            tabIndex="1"
          />
        </div>
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="lock" />
          <input
            type="password"
            className="portal-input h2 ghost pa2 mv2"
            placeholder="Password"
            id="loginPassword"
            onChange={this.updateInfo}
            value={password}
            tabIndex="2"
          />
        </div>
        <button
          id="login-button"
          className="f6 link dim br-pill ba bg-white bw1 ph3 pv2 mb2 dib black"
          onClick={this.tryLogin}
          tabIndex="3"
        >
          LOGIN
        </button>
        <Link to="policy">
          <div className="white-70 dim ph4 pv2 f6">Privacy Policy</div>
        </Link>
      </form>
    );
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default graphql(SIGNIN_USER, {
  name: "signinUser"
})(connect(mapStateToProps)(withRouter(MiniLogin)));
