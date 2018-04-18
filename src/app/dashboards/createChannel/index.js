import React from "react";
import ErrorSwap from "../../../utils/ErrorSwap";

class createChannel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: "",
			description: "",
			isTaken: false
		};
	}
	updateName = e => {
		this.setState({
			name: e.target.value.substring(0, 51)
		});
	};
	updateDesc = e => {
		this.setState({
			description: e.target.value.substring(0, 301)
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
						<h1 className="mb3 mt0 lh-title">Create Channel</h1>
						<time className="f7 ttu tracked white-80">
							Create a new channel within this Circle
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
											className="f6 white-80 db mb2"
										>
											This name must be unique to this
											Circle.
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											Sorry! This name has already been
											taken.
										</small>
									}
								/>
							</div>
							<div className="mv4">
								<label
									htmlFor="comment"
									className="f6 b db mb2"
								>
									Description{" "}
									<span className="normal white-80">
										(optional)
									</span>
								</label>
								<textarea
									id="comment"
									name="comment"
									className="db border-box w-100 measure ba pa2 mb2 ghost"
									aria-describedby="comment-desc"
									resize="false"
									maxLength="300"
									value={this.state.description}
									onChange={this.updateDesc}
								/>
								<small
									id="comment-desc"
									className="f6 white-80"
								>
									Describe channel in a few sentences.
								</small>
							</div>
						</div>
					</article>
					<div id="comment-desc" className="f6 white-80">
						By pressing "Create Channel" you will create a new
						government with a the above nameand description. After
						this point, all changes must be made through the
						democratic revision process.
					</div>
					<button
						id="create-circle-button"
						className="btn mt4"
						type="submit"
					>
						Create Channel
					</button>
				</form>
			</div>
		);
	}
}

export default createChannel;
