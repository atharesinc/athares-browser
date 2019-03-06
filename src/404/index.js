import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class NoMatch extends PureComponent {
  render() {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw"
        }}
        className="wrapper"
      >
        <div
          style={{
            color: "#FFFFFF",
            background: "transparent",
            height: "100vh",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div>
            <h1
              style={{
                display: "inline-block",
                borderRight: "1px solid rgba(255, 255, 255, 0.7)",
                margin: 0,
                marginRight: "20px",
                padding: "10px 23px 10px 0",
                fontSize: "24px",
                fontWeight: 500,
                verticalAlign: "top"
              }}
            >
              404
            </h1>
            <div
              style={{
                display: "inline-block",
                textAlign: "left",
                lineHeight: "49px",
                height: "49px",
                verticalAlign: "middle"
              }}
            >
              <h2
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  lineHeight: "inherit",
                  margin: 0,
                  padding: 0
                }}
              >
                This page could not be found.
              </h2>
            </div>
          </div>
          <ul className="list tc pl0 w-100 mt5">
            <li className="dib">
              <Link to="/">
                <span className="f5 f4-ns link white db pv2 ph3 transparent-hover-text">
                  Home
                </span>
              </Link>
            </li>
            <li className="dib">
              <Link to="/login">
                <span className="f5 f4-ns link white db pv2 ph3 transparent-hover-text">
                  Login
                </span>
              </Link>
            </li>
            <li className="dib">
              <Link to="/roadmap">
                <span className="f5 f4-ns link white db pv2 ph3 transparent-hover-text">
                  Roadmap
                </span>
              </Link>
            </li>
            <li className="dib">
              <Link to="/about">
                <span className="f5 f4-ns link white db pv2 ph3 transparent-hover-text">
                  About
                </span>
              </Link>
            </li>
            <li className="dib">
              <Link to="/help">
                <span className="f5 f4-ns link white db pv2 ph3 transparent-hover-text">
                  Help
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(NoMatch);
