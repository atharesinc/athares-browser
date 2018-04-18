import React from "react";
import { Link } from "react-router-dom";

const RevisionStats = ({
    createdAt,
    updatedAt,
    votes,
    ratified,
    backer,
    support,
    ...props
}) => {
    return (
        <div className="pa3 bg-theme-dark">
            <article data-name="slab-stat-small">
                <div className="cf">
                    <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
                        <dd className="f6 fw4 ml0 white-70">Date Proposed</dd>
                        <dd className="f3 fw6 ml0 white">
                            {new Date(createdAt).toLocaleDateString()}
                        </dd>
                    </dl>
                    <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
                        <dd className="f6 fw4 ml0 white-70">Date Ratified</dd>
                        <dd className="f3 fw6 ml0 white">
                            {!ratified
                                ? "N/A"
                                : new Date(updatedAt).toLocaleDateString()}
                        </dd>
                    </dl>
                    <dl className="fl fn-l w-50 dib-l w-auto-l lh-title">
                        <dd className="f6 fw4 ml0 white-70">Expires</dd>
                        <dd className="f3 fw6 ml0 white">
                            {new Date(
                                updatedAt + 60 * 60 * 1000 * 24 * 7
                            ).toLocaleDateString()}
                        </dd>
                    </dl>
                </div>
                <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
                    <dd className="f6 fw4 ml0 white-70">Votes to Support</dd>
                    <dd className="f3 fw6 ml0 white">{support}</dd>
                </dl>
                <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
                    <dd className="f6 fw4 ml0 white-70">Votes Against</dd>
                    <dd className="f3 fw6 ml0 white">
                        {votes.length - support}
                    </dd>
                </dl>
                <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
                    <dd className="f6 fw4 ml0 white-70">Ratified</dd>
                    <dd className="f3 fw6 ml0 white">
                        {ratified ? "Yes" : "No"}
                    </dd>
                </dl>
                <dl className="fl fn-l w-100 db w-auto-l lh-title mr5-l">
                    <dd className="f6 fw4 ml0 white-70">Backer</dd>
                    <Link to={`/app/user/:id`} className="f3 fw6 ml0 white">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center"
                            }}
                            className="ml0 f7 mt2"
                        >
                            <img
                                src={backer.icon}
                                className="db br-100 w3 h3 mr2"
                                alt=""
                            />
                            <small className="f5 white db ml2">
                                {backer.firstName + " " + backer.lastName}
                            </small>
                        </div>
                    </Link>
                </dl>
            </article>
            <small className="f7 white-70 db lh-copy" style={{ clear: "both" }}>
                By selecting "Accept" or "Reject" you testify that you have read
                the proposed legislation, and consider it to be necesssary, to
                benefit your circle, and is supported by reason and facts. If a
                law has more support votes than reject votes after the
                expiration it will become law, otherwise it will be discarded.
            </small>
        </div>
    );
};

export default RevisionStats;
