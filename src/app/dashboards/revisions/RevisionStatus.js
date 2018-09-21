import React from "react";
import { withRouter, Link } from "react-router-dom";

/*
@refactor - split into if(render) else (render) instead of conditionals
*/
const RevisionStatus = ({ amendment, support, votes, match }) => {
  // console.log(match);
  const circleID = match.url.match(/\/app\/circle\/(.+)\/revisions/)[1];
  if (amendment === null) {
    return (
      <div style={styles} className="f6 bg-theme-light white-80 mv0 pa2">
        <div
          className={`f7 green pa1 br-pill b--green ph2 bw1 ba lh-solid bg-none`}
        >
          NEW
        </div>
        <small>
          <span className="light-green">+{support}</span> /{" "}
          <span className="red">-{votes.length - support}</span>
        </small>
      </div>
    );
  } else {
    return (
      <div style={styles} className="f6 bg-theme-light white-80 mv0 pa2">
        <div className={`f7 black-80 pa1 br-pill ph2 lh-solid bg-theme-blue`}>
          REVISION
        </div>
        <Link
          to={`/app/circle/${circleID}/constitution#${amendment.id}`}
          className={`f7 white pa1 br-pill b--theme-blue bw1 ba ph2 lh-solid theme-blue`}
        >
          #{amendment.id}
        </Link>
        <small>
          <span className="light-green">+{support}</span> /{" "}
          <span className="red">-{votes.length - support}</span>
        </small>
      </div>
    );
  }
};

const styles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
};

const RevisionStatusWithRouter = withRouter(RevisionStatus);
export default RevisionStatusWithRouter;
