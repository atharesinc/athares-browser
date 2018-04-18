import React from "react";
import ImageUpload from "./imageUpload";
import ErrorSwap from "../../../utils/ErrorSwap";

class createCircle extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			icon:
				"https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-large-white.png",
			name: "",
			preamble: "",
			isTaken: false
		};
	}
	changeImage = imageUrl => {
		this.setState({
			icon: imageUrl
		});
	};
	updateName = e => {
		this.setState({
			name: e.target.value.substring(0, 51)
		});
	};
	updatePreamble = e => {
		this.setState({
			preamble: e.target.value.substring(0, 301)
		});
	};
	onSubmit = e => {
		e.preventDefault();
		console.log(this.state);
		// validate & trim fields

		// make sure name isnt taken
		// const isTaken = circleNameTakenMutation({variables: {name: this.state.name}});
		// if (isTaken) {
		// 	this.setState({
		// 		isTaken: true
		// 	});
		// 	return false;
		// }
		//upload image to AWS (propbably)
		// const awsURL = uploadImage(this.icon);
		// create circle
		// const circle = {
		// 	variables: {name: this.state.name, description: this.state.description, icon: awsURL}
		// };
		// const res = createCircleMutation(circle);
		// redirect to new circle dashboard
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
						<h1 className="mb3 mt0 lh-title">Create New Circle</h1>
						<time className="f7 ttu tracked white-80">
							Circles represent the digital repository for your
							government.
						</time>
						<header className="fn fl-ns w-50-ns pr4-ns">
							<ImageUpload
								onSet={this.changeImage}
								defaultImage={this.state.icon}
							/>
						</header>
						<div className="fn fl-ns w-50-ns mt4">
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
											This name must be unique.
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
									Preamble{" "}
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
									Describe your government in a few sentences.
									This will be visible at the top of the
									Constituion and lines out the basic vision
									of this government.
								</small>
							</div>
						</div>
					</article>
					<div id="comment-desc" className="f6 white-80">
						By pressing "Create Circle" you will create a new
						government with a the above name, preamble, and the
						selected image. After this point, all changes must be
						made through the democratic revision process.
					</div>
					<button
						id="create-circle-button"
						className="btn mt4"
						type="submit"
					>
						Create Circle
					</button>
				</form>
			</div>
		);
	}
}

export default createCircle;
