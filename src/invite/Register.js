import React, { useState, useGlobal } from "react";
import FeatherIcon from "feather-icons-react";
import { validateRegister } from "../utils/validators";
import { Link, withRouter } from "react-router-dom";
import swal from "sweetalert";
import { connect } from "react-redux";
import defaultUser from "../portal/defaultUser.json";
import sha from "simple-hash-browser";
import {
  CREATE_USER,
  SIGNIN_USER,
  CREATE_USER_PREF
} from "../graphql/mutations";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import { pair } from "utils/crypto";
import SimpleCrypto from "simple-crypto-js";

function MiniRegister(props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setUser] = useGlobal("user");
  const [, setPub] = useGlobal("pub");

  const tryRegister = async e => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateRegister({
      firstName,
      lastName,
      email,
      password
    });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      setLoading(false);
      return false;
    }

    let { createUser, signinUser, createUserPref } = props;

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
      setUser(userId);
      setPub(hashedToken);

      setLoading(false);
    } catch (err) {
      if (err.message.indexOf("Invalid Credentials") !== -1) {
        swal("Error", "Invalid Credentials", "error");
      } else {
        swal("Error", err.message, "error");
      }
      setLoading(false);
    }
  };
  const updateInfo = () => {
    setFirstName(document.getElementById("registerFirstName").value);
    setLastName(document.getElementById("registerLastName").value);
    setPassword(document.getElementById("registerPassword").value);
    setEmail(document.getElementById("registerEmail").value);
  };

  return (
    <form
      id="portal-register"
      className="wrapper w-100 slideInFromLeft"
      onSubmit={tryRegister}
    >
      <div className="portal-input-wrapper">
        <FeatherIcon className="portal-input-icon h1 w1" icon="user" />
        <input
          type="text"
          className="portal-input h2 ghost pa2 mv2"
          placeholder="First Name"
          id="registerFirstName"
          onChange={updateInfo}
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
          onChange={updateInfo}
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
          onChange={updateInfo}
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
          onChange={updateInfo}
          value={password}
          tabIndex="4"
        />
      </div>
      <button
        id="register-button"
        className="f6 link dim br-pill bg-white ba bw1 ph3 pv2 mb2 dib black"
        onClick={tryRegister}
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

export default compose(
  graphql(SIGNIN_USER, { name: "signinUser" }),
  graphql(CREATE_USER, { name: "createUser" }),
  graphql(CREATE_USER_PREF, { name: "createUserPref" })
)(withRouter(MiniRegister));
