import React, { Fragment, Component } from "react";
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
import { connect } from "react-redux";
import { updateDesc, updateTitle } from "../store/head/actions";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import Loader from "../components/Loader";
import sha from "simple-hash-browser";
import { SIGNIN_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      loading: false
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.history.replace("/app");
    } else {
      this.props.dispatch(updateChannel(null));
      this.props.dispatch(updateCircle(null));
      this.props.dispatch(updateRevision(null));
      // Update meta tags
      this.props.dispatch(updateDesc("Log in to Athares"));
      this.props.dispatch(updateTitle("Athares - Login"));
    }
  }
  tryLogin = async e => {
    this.props.dispatch(showLoading());
    e.preventDefault();
    await this.setState({ loading: true });
    const isValid = validateLogin({ ...this.state });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      this.setState({ loading: false });
      this.props.dispatch(hideLoading());
      return false;
    }
    const { signinUser } = this.props;
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
          signinUser: { token, user }
        }
      } = res;

      //store in redux
      window.localStorage.setItem("ATHARES_ALIAS", email);
      window.localStorage.setItem("ATHARES_HASH", hashedToken);
      window.localStorage.setItem("ATHARES_TOKEN", token);

      this.props.dispatch(updateUser(user.id));
      this.props.dispatch(updatePub(hashedToken));
      this.props.dispatch(hideLoading());
      this.setState({ loading: false });
      this.props.history.push("/app");
    } catch (err) {
      console.log(err);
      this.props.dispatch(hideLoading());
      swal("Error", err.message, "error");
      this.setState({ loading: false });
    }
  };
  updateInfo = () => {
    this.setState({
      password: document.getElementById("loginPassword").value,
      email: document.getElementById("loginEmail").value
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }
  render() {
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
            <Link to="register">
              {" "}
              <div className="switch-portal">I want to register</div>
            </Link>
            <Link to="policy">
              <div className="white-70 dim ph4 pv2 f6">
                {" "}
                By logging in you acknowledge that you agree to the Terms of Use
                and have read the Privacy Policy.
              </div>
            </Link>
          </form>
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default graphql(SIGNIN_USER, {
  name: "signinUser"
})(connect(mapStateToProps)(withRouter(Login)));
