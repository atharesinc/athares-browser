import React, { Component } from "react";
import SelectCornersDiv from "../../../utils/SelectCornersDiv";
import { Link, withRouter } from "react-router-dom";

export default class RevisionBoard extends Component {
	render() {
		const allRevisons = [
			revisions.filter(rev => !rev.ratified),
			revisions.filter(
				rev =>
					rev.ratified &&
					rev.updatedAt <
						new Date(new Date().getTime() - 86400000 * 7)
			),
			revisions.filter(
				rev =>
					rev.ratified &&
					rev.updatedAt >
						new Date(new Date().getTime() - 86400000 * 7)
			),
			revisions.filter(
				rev =>
					rev.ratfiied &&
					rev.updatedAt > new Date().getTime() &&
					rev.votes.filter(v => v.support).length >
						rev.votes.filter(v => !v.support).length
			)
		];
		console.log(allRevisons);
		return (
			<div id="revisions-wrapper">
				<h1 className="ma3 lh-title white">Revisions</h1>
				<small className="f6 white-80 db mb2 ml3">
					Review proposed legislation and changes to existing laws
				</small>
				<div id="revision-board-wrapper">
					{boards.map((b, i) => (
						<Board key={i} revisions={allRevisons[i]} title={b} />
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
			{revisions.map((rev, i) => <RevisionWithRouter key={i} {...rev} />)}
		</div>
	);
};

// Denote vote split
// denote whether it is new or a change to existing amendment
const Revision = ({
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
					<p className="f7 lh-copy measure mv3 white pre-wrap">
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
const RevisionWithRouter = withRouter(Revision);

const boards = ["New Revisions", "Ratified", "Ending Soon", "Recently Passed"];
const revisions = [
	{
		id: "1",
		createdAt: new Date().getTime(),
		updatedAt: new Date().getTime(),
		oldText: "",
		newText:
			"The government shall make no law prohibiting the use, production, and import of ion thrusters",
		amendment: null,
		title: "Deep Space Exploration Act",
		ratified: false,
		backer: {
			firstName: "Erlich",
			lastname: "Bachmann",
			icon: "http://mrmrs.github.io/photos/p/2.jpg"
		},
		votes: fakeVotes()
	},
	...fakeRevsions()
];

function fakeRevsions() {
	var users = [
		"https://assets3.thrillist.com/v1/image/1734098/size/tmg-article_default_mobile.jpg",
		"http://mrmrs.github.io/photos/p/1.jpg",
		"http://mrmrs.github.io/photos/p/8.jpg"
	];
	const num = Math.floor(Math.random() * 15 + 1);
	const revisions = [];
	const isNew = Math.random() > 0.5;
	for (let i = 0; i < num; ++i) {
		revisions.push({
			id: num + i + "-" + revisions.length + "-" + i,
			createdAt: new Date().getTime() - num * 1000 + num * 100,
			updatedAt: new Date(
				new Date().getTime() - 86400000 * Math.floor(Math.random() * 8)
			),
			oldText: isNew ? null : " The government shall make no law ...",
			newText: "The people will not appoint a head of state.",
			ratified: Math.random() > 0.25,
			backer: {
				firstName: "Erlich",
				lastname: "Bachmann",
				icon: users[Math.floor(Math.random() * users.length)]
			},
			amendment: { title: `Article ${i}` },
			votes: fakeVotes()
		});
	}
	return revisions;
}
function fakeVotes() {
	const num = Math.floor(Math.random() * 50 + 1);
	const votes = [];
	for (let i = 0; i < num; ++i) {
		votes.push({ id: num + i, support: Math.random() > 0.5 });
	}
	return votes;
}
