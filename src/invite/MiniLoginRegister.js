import React, { useState } from "reactn";
import Login from "./Login";
import Register from "./Register";

export default function MiniLoginRegister (){
  state = {
    loginVisible: false
  };
  const showLogin = () => {
    setState({
      loginVisible: true
    });
  };
  const showRegister = () => {
    setState({
      loginVisible: false
    });
  };
  
    let { loginVisible } = state;
    return (
      <div className="mv4 flex flex-column justify-start items-center w-100">
        <div className="flex flex-row items-center justify-around w-80 w-50-ns mb4">
          <div
            className={`white-50 pb2 bb ${loginVisible && "white"} f3`}
            style={{ borderColor: loginVisible ? "#00DFFC" : "transparent" }}
            onClick={showLogin}
          >
            Login
          </div>
          <div
            className={`white-50 pb2 bb ${!loginVisible && "white"} f3 `}
            style={{ borderColor: !loginVisible ? "#00DFFC" : "transparent" }}
            onClick={showRegister}
          >
            Register
          </div>
        </div>
        {loginVisible ? <Login /> : <Register />}
      </div>
    );
}
