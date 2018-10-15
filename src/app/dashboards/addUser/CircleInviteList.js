import React, { Component } from "react";
import ReactTags from "react-tag-autocomplete";
import TagComponent from "./TagComponent";

export default class CircleInviteList extends Component {
	state = {
		tags: [],
		suggestions: [
			{
				id: 3,
				name: "Bananas",
				icon: "/img/Athares-logo-small-white.png"
			},
			{
				id: 4,
				name: "Mangos",
				icon:
					"https://cdn2.medicalnewstoday.com/structure/images/social/dark_pinterest_7721.svg"
			},
			{
				id: 5,
				name: "Lemons",
				icon:
					"https://cdn2.medicalnewstoday.com/structure/images/social/dark_pinterest_7721.svg"
			},
			{
				id: 6,
				name: "Apricots",
				icon:
					"https://cdn2.medicalnewstoday.com/structure/images/social/dark_pinterest_7721.svg"
			},
			{
				id: 1,
				name: "Apples",
				icon:
					"https://cdn2.medicalnewstoday.com/structure/images/social/dark_pinterest_7721.svg"
			},
			{
				id: 2,
				name: "Pears",
				icon:
					"https://cdn2.medicalnewstoday.com/structure/images/social/dark_pinterest_7721.svg"
			}
		]
	};
	handleDelete = (i) => {
		const tags = this.state.tags.slice(0);
		const removed = tags.splice(i, 1);
		const suggestions = [].concat(this.state.suggestions, removed);
		this.setState({ tags, suggestions });
		this.props.updateList(tags);
	}

	handleAddition = (tag) => {
		const tags = [].concat(this.state.tags, tag);
		const suggestions = this.state.suggestions.filter(s => tag.id !== s.id);
		this.setState({ tags, suggestions });
		this.props.updateList(tags);
	}
	render() {
		return (
			<div className="wrapper black pv1">
				<ReactTags
					tags={this.state.tags}
					suggestions={this.state.suggestions}
					handleDelete={this.handleDelete}
					handleAddition={this.handleAddition}
					placeholder={
						this.props.shouldPlaceholder
							? "Type the name of a person"
							: " "
					}
					autofocus={true}
					tagComponent={TagComponent}
				/>
			</div>
		);
	}
}
