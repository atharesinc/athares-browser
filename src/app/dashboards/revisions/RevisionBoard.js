import React, { Component } from "react";
import SelectCornersDiv from "../../../utils/SelectCornersDiv";
import { Link, withRouter } from "react-router-dom";
import { getAllRevisions } from "../../../graphql/queries";
// import { subToCirclesRevisions } from "../../../graphql/subscriptions";
import { compose, graphql } from "react-apollo";
import Loader from "../../Loader";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";

class RevisionBoard extends Component {
    // componentDidMount() {
    // 	this.props.getAllRevisions.subscribeToMore({
    // 		document: subToCirclesRevisions,
    // 		variables: { id: this.props.id },
    // 		updateQuery: async (prev, { subscriptionData }) => {
    // 			await this.props.getAllRevisions.refetch();
    // 			console.log("updated");
    // 		}
    // 	});
    // }
    render() {
        console.log(this.props.getAllRevisions);
        const { error, loading, allRevisions } = this.props.getAllRevisions;
        if (error) {
            return null;
        }
        if (loading) {
            return (
                <div id="revisions-wrapper">
                    <h1 className="ma3 lh-title white">Revisions</h1>
                    <small className="f6 white-80 db mb2 ml3">
                        Review proposed legislation and changes to existing laws
                    </small>
                    <div id="revision-board-wrapper" className="column-center">
                        <Loader />
                    </div>
                </div>
            );
        }
        let revisions = [
            // non-ratified revisions
            allRevisions.filter(rev => rev.ratified),
            // ratified and not older than 7 days
            allRevisions.filter(
                rev =>
                    rev.ratified &&
                    rev.updatedAt <
                        moment(rev.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
                            .add(7, "days")
                            .format()
            ),
            allRevisions.filter(
                rev =>
                    rev.ratified &&
                    rev.updatedAt >
                        moment(rev.createdAt, "YYYY-MM-DDTHH:mm:ss.SSSZ")
                            .add(7, "days")
                            .format()
            ),
            allRevisions.filter(
                rev =>
                    rev.ratfiied &&
                    rev.updatedAt > moment().format() &&
                    rev.votes.filter(v => v.support).length >
                        rev.votes.filter(v => !v.support).length
            )
        ];
        console.log(revisions);
        return (
            <div id="revisions-wrapper">
                <h1 className="ma3 lh-title white">Revisions</h1>
                <small className="f6 white-80 db mb2 ml3">
                    Review proposed legislation and changes to existing laws
                </small>
                <div id="revision-board-wrapper">
                    {boards.map((b, i) => (
                        <Board key={i} revisions={revisions[i]} title={b} />
                    ))}
                </div>
            </div>
        );
    }
}

const Board = ({ title, revisions }) => {
    return (
        <div className="w-50 mv2 ml2 pa2 revision-board">
            <div className="bb b--white pa2 mb2">
                <div className="white">{title}</div>
            </div>
            <Scrollbars style={{ height: "100%", width: "100%" }}>
                {revisions.map((rev, i) => (
                    <RevisionWithRouter key={i} {...rev} />
                ))}
            </Scrollbars>
        </div>
    );
};

// Denote vote split
// denote whether it is new or a change to existing amendment
const RevisionCard = ({
    amendment,
    newText,
    createdAt,
    backer,
    votes,
    title,
    id,
    ...props
}) => {
    const support = votes.filter(({ support }) => support).length;
    return (
        <SelectCornersDiv className="mw5 mw6-ns hidden mb3">
            <Link to={`${props.match.url}/${id}`}>
                <h1 className="f6 bg-theme-light white-80 mv0 ph3 pv2">
                    {amendment !== null ? amendment.title : title}
                </h1>
                <div className="pa3 bg-theme">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                        className="mb2"
                    >
                        <div
                            className={`f7 white pa1 br-pill ph2 lh-solid bg-${
                                amendment !== null ? "theme-blue" : "green"
                            }`}
                        >
                            {amendment !== null ? "REVISION" : "NEW"}
                        </div>
                        <small>
                            <span className="light-green">+{support}</span> /{" "}
                            <span className="red">
                                -{votes.length - support}
                            </span>
                        </small>
                    </div>
                    <p
                        className="f7 lh-copy measure mv3 white pre-wrap h2"
                        style={{ overflow: "hidden" }}
                    >
                        {newText}
                    </p>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center"
                        }}
                        className="mt2"
                    >
                        <img
                            src={backer.icon}
                            className="db br-100 w2 h2 mr2"
                            alt=""
                        />
                        <small className="f6 white-70 db ml2">
                            {new Date(createdAt).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            </Link>
        </SelectCornersDiv>
    );
};
const RevisionWithRouter = withRouter(RevisionCard);

const boards = [
    "New Revisions",
    "Ratified",
    "Recently Passed",
    "Recently Rejected"
];

export default compose(
    graphql(getAllRevisions, {
        name: "getAllRevisions",
        options: ({ id }) => {
            return { variables: { circleId: id } };
        }
    })
    // graphql(subToCirclesRevisions, {
    // 	name: "subToCirclesRevisions",
    // 	options: ({ id }) => ({
    // 		variables: { id }
    // 	})
    // })
)(RevisionBoard);
