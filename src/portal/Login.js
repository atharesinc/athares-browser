import React, { Fragment, PureComponent } from "react";
import FeatherIcon from "feather-icons-react";
import swal from "sweetalert";
import { Link, withRouter } from "react-router-dom";
import { withGun } from "../utils/react-gun";
import { updateUser, updatePub } from "../store/state/actions";
import { validateLogin } from "../utils/validators";
import { pull } from "../store/state/reducers";
import { connect } from "react-redux";

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: ""
    };
  }
  componentDidMount() {
    if (this.props.user) {
      this.props.history.push("/app");
    }
  }
  tryLogin = async () => {
    const isValid = validateLogin({ ...this.state });

    if (isValid !== undefined) {
      swal("Error", isValid[Object.keys(isValid)[0]][0], "error");
      return false;
    }

    let { password, email } = this.state;

    let newUser = this.props.gun.user();

    newUser.auth(email, password, ack => {
      if (ack.err) {
        console.log(ack.err);
        if (
          ack.err ===
          "Auth attempt failed! Reason: Failed to decrypt secret! 0/1"
        ) {
          swal("Error", "Invalid password", "error");
        } else {
          swal("Error", "No user found with that information.", "error");
        }
        return false;
      }
      newUser.get("profile").once(profile => {
        // set the public key and id in redux to log in
        this.props.dispatch(updateUser(profile.id));
        this.props.dispatch(updatePub(ack.pub));
        this.props.history.push("/app");
      });
    });
  };
  updateInfo = () => {
    this.setState({
      password: document.getElementById("loginPassword").value,
      email: document.getElementById("loginEmail").value
    });
  };
  render() {
    const { email, password } = this.state;
    return (
      <Fragment>
        <div id="portal-header">
          <img
            src="/img/Athares-logo-small-white.png"
            id="portal-logo"
            alt="logo"
          />
          <img
            src="/img/Athares-full-small-white.png"
            id="portal-brand"
            alt="brand"
          />
        </div>
        <div className="wrapper" id="portal-login">
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
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default connect(mapStateToProps)(withRouter(withGun(Login)));
