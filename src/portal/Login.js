import React, { Fragment, Component } from "reactn";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";
import { Link, withRouter } from "react-router-dom";
import {
  updateUser,
  updatePub,
  updateChannel,
  updateCircle,
  updateRevision
} from "../store/state/actions";
import { validateLogin } from "../utils/validators";
import { pull } from "../store/state/reducers";

import { showLoading, hideLoading } from "react-redux-loading-bar";
import Loader from "../components/Loader";
import sha from "simple-hash-browser";
import { SIGNIN_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";

function Login (){
  
    this.state = {
      password: "",
      email: "",
      loading: false
    };
  

useEffect(()=>{
 componentMount();
}, [])

const componentMount =    => {
    if (props.user) {
      props.history.replace("/app");
    } else {
      props.dispatch(updateChannel(null));
      props.dispatch(updateCircle(null));
      props.dispatch(updateRevision(null));
    }
  }
  const tryLogin = async e => {
    props.dispatch(showLoading());
    e.preventDefault();
    await this.setState({ loading: true });
    const isValid = validateLogin({ ...this.state });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      this.setState({ loading: false });
      props.dispatch(hideLoading());
      return false;
    }
    const { signinUser } = props;
    let { password, email } = this.state;
    try {
      let hashedToken = await sha(password);

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
      this.setState({ loading: false });
      props.history.push("/app");
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
  
    const { email, password, loading } = this.state;
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
          <div
            className="wrapper flex flex-row justify-center items-center"
            id="portal-login"
          >
            <Loader />
          </div>
        ) : (
          <form className="wrapper" id="portal-login" onSubmit={this.tryLogin}>
            <p className="portal-text">Login with the form below</p>
            <div className="portal-input-wrapper">
              <FeatherIcon className="portal-input-icon h1 w1" icon="at-sign" />
              <input
                placeholder="Email"
                className="portal-input h2 ghost pa2"
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
                className="portal-input h2 ghost pa2"
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
            <Link
              to="forgot"
              className="mb2 w-100 flex items-center justify-center pointer"
            >
              <button
                id="forgot-button"
                className="f6 link glow br-pill ph3 pv2 bg-theme mb2 dib white pointer"
                tabIndex="4"
              >
                FORGOT PASSWORD
              </button>
            </Link>
            <Link to="register">
              <div className="switch-portal">I want to register</div>
            </Link>
            <Link to="policy">
              <div className="white-70 dim ph4 pv2 f6">
                By logging in you acknowledge that you agree to the Terms of Use
                and have read the Privacy Policy.
              </div>
            </Link>
          </form>
        )}
      </Fragment>
    );
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default graphql(SIGNIN_USER, {
  name: "signinUser"
})(connect(mapStateToProps)(withRouter(Login)));
