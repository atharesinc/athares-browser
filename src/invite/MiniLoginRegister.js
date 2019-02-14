import React, { Component } from "react";
import Login from "./Login";
import Register from "./Register";

export default class MiniLoginRegister extends Component {
  state = {
    loginVisible: false
  };
  showLogin = () => {
    this.setState({
      loginVisible: true
    });
  };
  showRegister = () => {
    this.setState({
      loginVisible: false
    });
  };
  render() {
    let { loginVisible } = this.state;
    return (
      <div className="mv4 flex flex-column justify-start items-center w-100">
        <div className="flex flex-row items-center justify-around w-80 w-50-ns mb4">
          <div
            className={`white-50 pb2 bb ${loginVisible && "white"} f3`}
            style={{ borderColor: loginVisible ? "#00DFFC" : "transparent" }}
            onClick={this.showLogin}
          >
            Login
          </div>
          <div
            className={`white-50 pb2 bb ${!loginVisible && "white"} f3 `}
            style={{ borderColor: !loginVisible ? "#00DFFC" : "transparent" }}
            onClick={this.showRegister}
          >
            Register
          </div>
        </div>
        {loginVisible ? <Login /> : <Register />}
      </div>
    );
  }
}
