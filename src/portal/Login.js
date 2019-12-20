import React, { Fragment, useState, useGlobal, useEffect } from "reactn";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";
import { Link, withRouter } from "react-router-dom";

import { validateLogin } from "../utils/validators";

import Loader from "../components/Loader";
import sha from "simple-hash-browser";
import { SIGNIN_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";

function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useGlobal("setUser");
  const [, setPub] = useGlobal("setPub");
  const [, setActiveChannel] = useGlobal("setActiveChannel");
  const [, setActiveCircle] = useGlobal("setActiveCircle");
  const [, setActiveRevision] = useGlobal("setActiveRevision");

  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = () => {
    if (user) {
      props.history.replace("/app");
    } else {
      setActiveChannel(null);
      setActiveCircle(null);
      setActiveRevision(null);
    }
  };
  const tryLogin = async e => {
    setLoading(true);
    e.preventDefault();
    const isValid = validateLogin({ email, password });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      setLoading(false);
      return false;
    }
    const { signinUser } = props;
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

      setUser(userId);
      setPub(hashedToken);
      setLoading(false);
      props.history.push("/app");
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
    setPassword(document.getElementById("loginPassword").value);
    setEmail(document.getElementById("loginEmail").value);
  };

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
        <form className="wrapper" id="portal-login" onSubmit={tryLogin}>
          <p className="portal-text">Login with the form below</p>
          <div className="portal-input-wrapper">
            <FeatherIcon className="portal-input-icon h1 w1" icon="at-sign" />
            <input
              placeholder="Email"
              className="portal-input h2 ghost pa2"
              required
              type="email"
              onChange={updateInfo}
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
              onChange={updateInfo}
              value={password}
              tabIndex="2"
            />
          </div>
          <button
            id="login-button"
            className="f6 link dim br-pill ba bg-white bw1 ph3 pv2 mb2 dib black"
            onClick={tryLogin}
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

export default graphql(SIGNIN_USER, {
  name: "signinUser"
})(withRouter(Login));
