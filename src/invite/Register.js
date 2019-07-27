import React, { PureComponent } from "react";
import FeatherIcon from "feather-icons-react";
import { validateRegister } from "../utils/validators";
import { Link, withRouter } from "react-router-dom";
import swal from "sweetalert";
import { updateUser, updatePub } from "../store/state/actions";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import defaultUser from "../portal/defaultUser.json";
import sha from "simple-hash-browser";
import {
  CREATE_USER,
  SIGNIN_USER,
  CREATE_USER_PREF
} from "../graphql/mutations";
import { graphql, compose } from "react-apollo";
import { pair } from "utils/crypto";
import SimpleCrypto from "simple-crypto-js";

class MiniRegister extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      loading: false
    };
  }
  tryRegister = async e => {
    e.preventDefault();
    this.props.dispatch(showLoading());
    await this.setState({ loading: true });

    const isValid = validateRegister({
      ...this.state
    });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      this.props.dispatch(showLoading());
      await this.setState({ loading: false });
      return false;
    }

    let { createUser, signinUser, createUserPref } = this.props;
    let { firstName, lastName, password, email } = this.state;

    let hashedToken = await sha(password);
    let simpleCrypto = new SimpleCrypto(hashedToken);

    try {
      let keys = await pair();
      await createUser({
        variables: {
          firstName,
          lastName,
          email,
          icon: defaultUser.text,
          password: hashedToken,
          pub: keys.pub,
          priv: simpleCrypto.encrypt(keys.priv)
        }
      });
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
      await createUserPref({
        variables: {
          id: userId
        }
      });
      //store in redux
      window.localStorage.setItem("ATHARES_ALIAS", email);
      window.localStorage.setItem("ATHARES_HASH", hashedToken);
      window.localStorage.setItem("ATHARES_TOKEN", token);
      this.props.dispatch(updateUser(userId));
      this.props.dispatch(updatePub(hashedToken));

      this.props.dispatch(hideLoading());
      await this.setState({ loading: false });
    } catch (err) {
      if (err.message.indexOf("Invalid Credentials") !== -1) {
        swal("Error", "Invalid Credentials", "error");
      } else {
        swal("Error", err.message, "error");
      }
      this.props.dispatch(hideLoading());
      await this.setState({ loading: false });
    }
  };
  updateInfo = () => {
    this.setState({
      firstName: document.getElementById("registerFirstName").value,
      lastName: document.getElementById("registerLastName").value,
      password: document.getElementById("registerPassword").value,
      email: document.getElementById("registerEmail").value
    });
  };
  render() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <form
        id="portal-register"
        className="wrapper w-100 slideInFromLeft"
        onSubmit={this.tryRegister}
      >
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="user" />
          <input
            type="text"
            className="portal-input h2 ghost pa2 mv2"
            placeholder="First Name"
            id="registerFirstName"
            onChange={this.updateInfo}
            value={firstName}
            tabIndex="1"
          />
        </div>
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="user" />
          <input
            type="text"
            className="portal-input h2 ghost pa2 mv2"
            placeholder="Last Name"
            id="registerLastName"
            onChange={this.updateInfo}
            value={lastName}
            tabIndex="2"
          />
        </div>
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="at-sign" />
          <input
            placeholder="Email"
            className="portal-input h2 ghost pa2 mv2"
            required
            type="email"
            onChange={this.updateInfo}
            value={email}
            id="registerEmail"
            tabIndex="3"
          />
        </div>
        <div className="portal-input-wrapper">
          <FeatherIcon className="portal-input-icon h1 w1" icon="lock" />
          <input
            type="password"
            className="portal-input h2 ghost pa2 mv2"
            placeholder="Password"
            id="registerPassword"
            onChange={this.updateInfo}
            value={password}
            tabIndex="4"
          />
        </div>
        <button
          id="register-button"
          className="f6 link dim br-pill bg-white ba bw1 ph3 pv2 mb2 dib black"
          onClick={this.tryRegister}
          tabIndex="4"
        >
          REGISTER
        </button>

        <Link to="policy">
          <div className="white-70 dim ph4 pv2 f6">Privacy Policy</div>
        </Link>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}

export default compose(
  graphql(SIGNIN_USER, { name: "signinUser" }),
  graphql(CREATE_USER, { name: "createUser" }),
  graphql(CREATE_USER_PREF, { name: "createUserPref" })
)(connect(mapStateToProps)(withRouter(MiniRegister)));
