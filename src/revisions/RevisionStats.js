import React from "reactn";
import { Link } from "react-router-dom";
import moment from "moment";
import ReactCountdownClock from "react-countdown-clock";

const RevisionStats = ({
  createdAt,
  votes,
  backer,
  support,
  expires,
  hasExpired,
  passed,
  checkIfPass
}) => {
  let size = window
    .getComputedStyle(document.getElementById("root"))
    .getPropertyValue("font-size")
    .replace("px", "");
  let remaining = (moment(expires).valueOf() - moment().valueOf()) / 1000;
  return (
    <div className="pa3 bg-theme-dark" id="revision-stats">
      <article data-name="slab-stat-small">
        <div className="cf">
          <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
            <dd className="f6 fw4 ml0 white-70">Date Proposed</dd>
            <dd className="f3 fw6 ml0 white">
              {moment(createdAt).format("MM/DD/YY hh:mma")}
            </dd>
          </dl>
          <dl className="fl fn-l w-50 dib-l w-auto-l lh-title">
            <dd className="f6 fw4 ml0 white-70">Expires</dd>
            <dd className="f3 fw6 ml0 white">
              {moment(expires).format("MM/DD/YY hh:mma")}
            </dd>
          </dl>
        </div>
        <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
          <dd className="f6 fw4 ml0 white-70">Votes to Support</dd>
          <dd className="f3 fw6 ml0 white">{support}</dd>
        </dl>
        <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
          <dd className="f6 fw4 ml0 white-70">Votes Against</dd>
          <dd className="f3 fw6 ml0 white">{votes.length - support}</dd>
        </dl>
        {hasExpired && (
          <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
            <dd className="f6 fw4 ml0 white-70">Passed?</dd>
            <dd className="f3 fw6 ml0 white">{passed ? "Yes" : "No"}</dd>
          </dl>
        )}
        <div className="w-100 flex flex-row justify-between items-center">
          <dl className="w-50 db lh-title mr5-l">
            <dd className="f6 fw4 ml0 white-70">Backer</dd>
            <Link to={`/app/user/${backer.id}`} className="f3 fw6 ml0 white">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
                className="ml0 f7 mt2"
              >
                <img src={backer.icon} className="db br-100 w3 h3 mr2" alt="" />
                <small className="f5 white db ml2">
                  {backer.firstName + " " + backer.lastName}
                </small>
              </div>
            </Link>
          </dl>
          {remaining > 0 && (
            <dl className="w-50 db lh-title mr5-l">
              <dd className="f6 fw4 ml0 white-70">Time Remaining</dd>
              <dd className="f3 fw6 ml0 white mt2">
                <ReactCountdownClock
                  seconds={remaining}
                  color="#00dcff"
                  weight={size * 0.3}
                  alpha={0.7}
                  timeFormat={"hms"}
                  size={size * 4}
                  font={"sans-serif"}
                  onComplete={checkIfPass}
                />
              </dd>
            </dl>
          )}
        </div>
      </article>
    </div>
  );
};

export default RevisionStats;
