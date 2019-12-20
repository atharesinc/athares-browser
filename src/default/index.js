import React, { useState, useGlobal, useEffect, withGlobal } from "reactn";
import { Link } from "react-router-dom";

import { graphql } from "react-apollo";
import { GET_CHANNELS_BY_CIRCLE_ID } from "../graphql/queries";
import NoticeBoard from "./NoticeBoard";
import FeatherIcon from "feather-icons-react";

function Dashboard(props) {
  const [news, setNews] = useState([]);
  const [user, setUser] = useGlobal("user");
  const [activeCircle, setActiveCircle] = useGlobal("activeCircle");
  const [, setActiveChannel] = useGlobal("setActiveChannel");
  const [, setActiveRevision] = useGlobal("setActiveRevision");

  useEffect(() => {
    componentMount();
  }, []);

  const back = () => {
    props.history.push(`/app`);
  };

  const componentMount = () => {
    let circleId = props.location.pathname.match(/\/circle\/([a-zA-Z0-9]{25})/);
    if (circleId !== null) {
      circleId = circleId[1];
      setActiveCircle(circleId);
    }
    setActiveChannel(null);
    setActiveRevision(null);
  };
  useEffect(() => {
    let circleId = props.location.pathname.match(/\/circle\/([a-zA-Z0-9]{25})/);

    if (circleId !== null) {
      circleId = circleId[1];

      if (activeCircle !== circleId) {
        setActiveCircle(circleId);
      }
    }
  }, [props.location.pathname, activeCircle]);

  return (
    <div
      id="dashboard-wrapper"
      className="horizontal pa3 pt0"
      style={{
        display: "block"
      }}
    >
      <div className="flex mobile-nav">
        <Link to="/app" className="flex justify-center items-center">
          <FeatherIcon
            icon="chevron-left"
            className="white db dn-l"
            onClick={back}
          />
        </Link>
        <div
          className="contain bg-center w4 pa2 mb2 dn-l"
          style={{
            backgroundImage: "url(/img/Athares-type-large-white.png)",
            height: "3rem"
          }}
        />
      </div>
      <div
        className="contain bg-center h4 pa2 mb2 dn db-l"
        style={{
          backgroundImage: "url(/img/Athares-type-large-white.png)",
          height: "3rem",
          margin: "2em auto"
        }}
      />
      <div className="f7 ttu tracked white-80 mb3 tr-m tr-s">
        Distributed Democracy Platform
      </div>
      <div className="mw9 center">
        {user ? (
          <div className="cf mb3">
            <Link className="fl w-100 pv2" to={"/app/new/circle"}>
              <div className="bg-white-10 tc dashboard-item">
                <div className="dashboard-title white">Create New Circle</div>
              </div>
            </Link>
            {/*<Link className="fl w-100 w-50-ns pv2" to={"/app/new/message"}>
                                <div className="bg-white-20 tc dashboard-item">
                                  <div className="dashboard-title white">Message User</div>
                                </div>
                            </Link> */}
          </div>
        ) : (
          <Link className="pv3 w-100 ph4" to={"/login"}>
            <div className="bg-white-10 pv3 w-100 ph4 tracked tc transparent-hover-white">
              You are not signed in
            </div>
          </Link>
        )}
        <div className="bg-white-20 mt2 pv3 w-100 ph4 ttu tracked">
          Athares News
        </div>
        <NoticeBoard activeCircle={props.activeCircle} />
      </div>
    </div>
  );
}

export default withGlobal(({ activeCircle }) => ({ activeCircle }))(
  graphql(GET_CHANNELS_BY_CIRCLE_ID, {
    name: "getCircle",
    options: ({ activeCircle }) => ({ variables: { id: activeCircle || "" } })
  })(Dashboard)
);
