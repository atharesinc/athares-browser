import React from "react";
import { withRouter, Link } from "react-router-dom";

const RevisionStatus = ({ amendment, support, votes, circle }) => {
    if (amendment) {
        return (
            <div className={`f6 bg-theme-light white-80 mv0 pa2 flex flex-column flex-row-ns justify-start justify-between-ns items-start items-center-ns`}>
                <div
                    className={`f7 black-80 pa1 br-pill ph2 lh-solid bg-theme-blue`}
                >
                    REVISION
                </div>
                <Link
                    to={`/app/circle/${circle}/constitution#${amendment.id}`}
                    className={`f7 pa1 br-pill b--theme-blue bw1 ba ph2 lh-solid theme-blue`}
                >
                    #{amendment.id}
                </Link>
                <small >
                    <span className="light-green">+{support}</span> /{" "}
                    <span className="red">-{votes.length - support}</span>
                </small>
            </div>
        );
    } else {
        return (
            <div className={`f6 bg-theme-light white-80 mv0 pa2 flex direction-row justify-between  items-center`}>
                <div
                    className={`f7 pa1 br-pill ph2 bw1 ba lh-solid bg-none`}
                    style={{ color: "#9eebcf", borderColor: "#9eebcf" }}
                >
                    NEW
                </div>
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
