import React from "react";
import ErrorSwap from "../../../utils/ErrorSwap";

class createAmendment extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			amendment: "",
			isTaken: false
		};
	}
	updateName = e => {
		this.setState({
			name: e.target.value.substring(0, 51)
		});
	};
	updateAmend = e => {
		this.setState({
			amendment: e.target.innerText.substring(0, 301)
		});
	};
	onSubmit = e => {
		e.preventDefault();
		console.log(this.state);
		// validate & trim fields

		// make sure name isnt taken
		// const isTaken = channelNameInCircleTakenMutation({variables: {name: this.state.name}});
		// if (isTaken) {
		// 	this.setState({
		// 		isTaken: true
		// 	});
		// 	return false;
		// }

		// create channel
		// const channel = {
		// 	variables: {name: this.state.name, description: this.state.description}
		// };
		// const res = createChannelMutation(channel);
		// redirect to newly created channel dashboard
	};
	clearError = () => {
		this.setState({
			isTaken: false
		});
	};
	render() {
		return (
			<div id="dashboard-wrapper">
				<form
					className="pa4 white wrapper"
					onSubmit={this.onSubmit}
					id="create-circle-form"
					style={{
						overflowY: "scroll"
					}}
				>
					<article className="cf">
						<h1 className="mb3 mt0 lh-title">Create Amendment</h1>
						<time className="f7 ttu tracked white-60">
							Draft a new piece of legislation for your Circle.
						</time>
						<div className="fn mt4">
							<div className="measure mb4">
								<label htmlFor="name" className="f6 b db mb2">
									Name
								</label>
								<input
									id="name"
									className="input-reset ba pa2 mb2 db w-100 ghost"
									type="text"
									aria-describedby="name-desc"
									required
									value={this.state.name}
									onChange={this.updateName}
								/>
								<ErrorSwap
									condition={!this.state.isTaken}
									normal={
										<small
											id="name-desc"
											className="f6 white-60 db mb2"
										>
											Provide a name for your new
											amendment.
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											Amendment must have a name
										</small>
									}
								/>
							</div>
							<div className="mv4">
								<label
									htmlFor="comment"
									className="f6 b db mb2"
								>
									Amendment
								</label>
								<div
									contentEditable={true}
									className={`f6 amendment-text editableText ghost`}
									onInput={this.updateAmend}
									value={this.state.amendment}
									suppressContentEditableWarning
								>
									{this.state.amendment}
								</div>
								<ErrorSwap
									condition={!this.state.isTaken}
									normal={
										<small
											id="comment-desc"
											className="f6 white-60"
										>
											Draft your amendment. What do you
											want to add to your government?
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											You can't submit an empty amendment.
										</small>
									}
								/>
							</div>
						</div>
					</article>
					<div id="comment-desc" className="f6 white-60">
						Pressing "Draft Amendment" will create a new revision
						for this amendment. Drafts must first be ratified by a
						minimum electorate of Circle members, and then must be
						approved with a majority of votes. Amendment drafts are
						publicly accessible, but can be removed by the owner at
						any point before ratification.
					</div>
					<button
						id="create-circle-button"
						className="btn mt4"
						type="submit"
					>
						Draft Amendment
					</button>
				</form>
			</div>
		);
	}
}

export default createAmendment;
