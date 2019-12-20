import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  useEffect(() => {
    document.getElementById("splash-nav").style.backgroundColor = scrolled
      ? "#FFFFFF"
      : "transparent";
  }, [props.scrolled]);

  const { scrolled } = props;

  const logo = scrolled
    ? "/img/Athares-owl-logo-large-black.png"
    : "/img/Athares-owl-logo-large-white.png";

  const brand = scrolled
    ? "/img/Athares-type-small-black.png"
    : "/img/Athares-type-small-white.png";

  const textStyle = scrolled ? whiteStyle : normalStyle;

  return (
    <div
      className="dt w-100 center tracked ph1"
      id="splash-nav"
      style={textStyle}
    >
      <div className="dtc v-mid pa1 ph2">
        <Link
          to="/"
          className="flex flex-row justify-start items-center ma1 dim"
        >
          <img src={logo} alt="A" className="pr2" style={{ height: "3em" }} />
          <img src={brand} alt="Athares" className="h2 dn db-ns" />
        </Link>
      </div>
      <div className="dtc v-mid tr pa1 pr3">
        <Link to="/roadmap">
          <div
            className="f6 fw4 dim no-underline dn dib-l pv2 ph3"
            style={textStyle}
          >
            Roadmap
          </div>
        </Link>
        <Link to="/about">
          <div
            className="f6 fw4 dim no-underline dn dib-l pv2 ph3"
            style={textStyle}
          >
            About
          </div>
        </Link>
        <Link to="/login">
          <div
            className="f6 fw4 dim br-pill ba bw1 ph3 pv2 dib"
            style={textStyle}
          >
            Login
          </div>
        </Link>
      </div>
    </div>
  );
}

const whiteStyle = {
  color: "#000000",
  backgroundColor: "#FFFFFF"
};

const normalStyle = {
  color: "#FFFFFF",
  backgroundColor: "transparent"
};
