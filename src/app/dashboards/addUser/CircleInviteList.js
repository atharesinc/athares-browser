import React, { Component } from "react";
import ReactTags from "react-tag-autocomplete";
import TagComponent from "./TagComponent";

export default class CircleInviteList extends Component {
	state = {
		search: ""
	};
	delete = i => {
		// returns the index of the selected user we'd like to remove 
		let updatedListOfSelections = this.props.selectedUsers.filter((u, it) => i !== it);
		this.props.updateList(updatedListOfSelections);
	};
	inputChange = input => {
		if (this.props.selectedUsers.length >= 6) {
			return;
		}
		this.setState({
			search: input
		});
	};
	addition = user => {
			const newSelectedList = [...this.props.selectedUsers, user];
			this.props.updateList(newSelectedList);
		
	};
	render() {
		let { suggestions, selectedUsers } = this.props;
		if (this.state.search.trim().length >= 3 && selectedUsers.length < 7) {
			// display some results to the user
			const input = this.state.search.trim();
			// filter out names that don't meet criteria and filter out alreadys selected users
			suggestions = suggestions
				.filter(s => s.firstName.indexOf(input) !== -1)
				.filter(
					s => selectedUsers.findIndex(su => su.id === s.id) === -1
				);
		} else {
			suggestions = [];
		}
		return (
			<div className="wrapper black">
				<ReactTags
					tags={this.props.selectedUsers}
					suggestions={suggestions}
					handleDelete={this.delete}
					handleAddition={this.addition}
					handleInputChange={this.inputChange}
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