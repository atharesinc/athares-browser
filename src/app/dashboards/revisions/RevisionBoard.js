import React, { Component } from "react";
// import SelectCornersDiv from "../../../utils/SelectCornersDiv";
import { Link, withRouter } from "react-router-dom";
import Loader from "../../Loader";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import { withGun } from "react-gun";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";

class RevisionBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            circle: null,
            revisions: []
        };
    }
    componentDidMount() {
        let revisions = [];
        let thisCircle = {};
        let circleRef = this.props.gun
            .get("circles")
            .get(this.props.activeCircle);
        let amendmentsRef = circleRef.get("amendments");
        circleRef.once(circle => {
            thisCircle = circle;
            circleRef.get("revisions").forEach(revision => {
                // if this is a revision to an existing amendment, replace the amendment ID with the actual amendment
                if (revision.amendment) {
                    amendmentsRef.get(revision.amendment).once(amendment => {
                        revision.amendment = amendment;
                        revisions.push(revision);
                    });
                } else {
                    revisions.push(revision);
                }
            });
        });

        this.setState({
            revisions,
            circle: thisCircle
        });
    }
    render() {
        const { revisions: allRevisions, circle } = this.state;
        if (!circle) {
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
                    rev.ratified &&
                    rev.updatedAt > moment().format() &&
                    rev.votes.filter(v => v.support).length >
                        rev.votes.filter(v => !v.support).length
            )
        ];
        // let revisions = [[fakeRevision, fakeRevision], [], [], []];
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
            <Scrollbars
                style={{
                    height: revisions.length * 11.5 + "em",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}
            >
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
                        <span className="red">-{votes.length - support}</span>
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
    );
};
const RevisionWithRouter = withRouter(RevisionCard);

const boards = [
    "New Revisions",
    "Ratified",
    "Recently Passed",
    "Recently Rejected"
];

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle")
    };
}

export default withGun(withRouter(connect(mapStateToProps)(RevisionBoard)));

// const fakeRevision = {
//     id: "1",
//     createdAt: new Date().getTime() - 37 * 1000 + 37 * 100,
//     updatedAt: new Date(
//         new Date().getTime() - 86400000 * Math.floor(Math.random() * 8)
//     ),
//     oldText:
//         "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.",
//     newText: `All legislative Pwers. Herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives.

// kjsndfkjsndkfjn  sdf sadf sdf sdf

// sdfsdfsdf`,
//     amendment: { id: 4 },
//     title: "Deep Space Exploration Act",
//     ratified: true,
//     backer: {
//         firstName: "Erlich",
//         lastName: "Bachmann",
//         icon: "http://mrmrs.github.io/photos/p/2.jpg",
//         id: "s9d87f6g9"
//     },
//     votes: fakeVotes()
// };
// function fakeVotes() {
//     const num = Math.floor(Math.random() * 50 + 1);
//     const votes = [];
//     for (let i = 0; i < num; ++i) {
//         votes.push({ id: num + i, support: Math.random() > 0.5 });
//     }
//     return votes;
// }
