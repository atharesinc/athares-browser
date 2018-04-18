import React from "react";
import ImageUpload from "../createCircle/imageUpload";
import ErrorSwap from "../../../utils/ErrorSwap";
import Phone from "react-phone-number-input";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import { Link } from "react-router-dom";

export default class EditUser extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// icon: "/img/user-default.png",
			icon:
				"https://s3.us-east-2.amazonaws.com/athares-images/erlich.jpg",
			firstName: "Erlich",
			lastName: "Bachman",
			username: "erhlich.bachman.1",
			phone: "+15551234567",
			email: "erlich@avia.to",
			phoneTaken: false,
			emailTaken: false,
			usernameTaken: false
		};
	}
	changeImage = imageUrl => {
		this.setState({
			icon: imageUrl
		});
	};
	updateFirstName = e => {
		this.setState({
			firstName: e.target.value.substring(0, 51)
		});
	};
	updateLastName = e => {
		this.setState({
			lastName: e.target.value.substring(0, 51)
		});
	};
	updateUsername = e => {
		this.setState({
			username: e.target.value.substring(0, 100)
		});
	};
	updatePhone = number => {
		/* do we trim + off of beginning? */
		this.setState({
			phone: number
		});
	};
	updateEmail = e => {
		this.setState({
			email: e.target.value.substring(0, 100)
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
			phoneTaken: false,
			emailTaken: false,
			usernameTaken: false
		});
	};
	render() {
		return (
			<div id="dashboard-wrapper">
				<form
					className="pa4 white wrapper"
					onSubmit={this.onSubmit}
					id="update-user-form"
					style={{
						overflowY: "scroll"
					}}
				>
					<article className="cf">
						<div
							className="w-100 row-center"
							style={{
								justifyContent: "space-between",
								flexDirection: "row-reverse"
							}}
						>
							<Link
								className="f6 link dim br-pill ba bw1 ph3 pv2 mh4-ns mh2 dib white"
								to="/app/user"
							>
								BACK
							</Link>
							<h1 className="mv0 lh-title">Edit Info</h1>
						</div>
						<header className="fn fl-ns w-50-ns pr4-ns">
							<ImageUpload
								onSet={this.changeImage}
								defaultImage={this.state.icon}
							/>
							<small
								id="name-desc"
								className="f6 white-80 db mb2"
							>
								Your profile picture will be cropped as a
								circle. It is recommended you upload a square
								photo with dimensions around 250x250 pixels.
							</small>
						</header>
						<div className="fn fl-ns w-50-ns mt4">
							<div className="row-center">
								<div className="w-50 mb4">
									<label
										htmlFor="firstName"
										className="f6 b db mb2"
									>
										First Name
									</label>
									<input
										id="firstName"
										className="input-reset ba pa2 mb2 db ghost w-90"
										type="text"
										aria-describedby="name-desc"
										required
										value={this.state.firstName}
										onChange={this.updateFirstName}
									/>
								</div>
								<div className="w-50 mb4">
									<label
										htmlFor="lastName"
										className="f6 b db mb2"
									>
										Last Name
									</label>
									<input
										id="lastName"
										className="input-reset ba pa2 mb2 db ghost w-90"
										type="text"
										aria-describedby="edit-last-name"
										required
										value={this.state.lastName}
										onChange={this.updateLastName}
									/>
								</div>
							</div>
							<div className="measure mb4">
								<label htmlFor="name" className="f6 b db mb2">
									Phone Number
								</label>
								<Phone
									placeholder="Please enter a phone number"
									value={this.state.phone}
									country="US"
									inputClassName="db w-100 ghost pa2"
									aria-describedby="name-desc"
									required
									onChange={this.updatePhone}
									nativeCountrySelect
									className="mv2"
								/>
								<ErrorSwap
									condition={!this.state.phoneTaken}
									normal={
										<small
											id="name-desc"
											className="f6 white-80 db mb2"
										>
											Your phone number is used for
											multi-factor authentication. This
											number must be unique.
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											This number has already been taken.
										</small>
									}
								/>
							</div>
							<div className="measure mb4">
								<label htmlFor="email" className="f6 b db mb2">
									Email Address
								</label>
								<input
									id="email"
									className="input-reset ba pa2 mb2 db w-100 ghost"
									type="text"
									aria-describedby="name-desc"
									required
									value={this.state.email}
									onChange={this.updateEmail}
								/>
								<ErrorSwap
									condition={!this.state.emailTaken}
									normal={
										<small
											id="name-desc"
											className="f6 white-80 db mb2"
										>
											An email address is used for
											multi-factor authentication. This
											number must be unique.
										</small>
									}
									error={
										<small
											id="name-desc"
											className="f6 red db mb2"
										>
											This email has already been taken.
										</small>
									}
								/>
							</div>
							<div className="measure mb4">
								<label
									htmlFor="username"
									className="f6 b db mb2"
								>
									Unique Name
								</label>
								<input
									id="username"
									className="input-reset ba pa2 mb2 db w-100 ghost"
									type="text"
									aria-describedby="name-desc"
									required
									value={this.state.username}
									onChange={this.updateUsername}
								/>
								<ErrorSwap
									condition={!this.state.usernameTaken}
									normal={
										<small
											id="name-desc"
											className="f6 white-80 db mb2"
										>
											This is a human-readable way to
											uniquely identify each user. This
											name must be unique.
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
						</div>
					</article>

					<button
						id="create-circle-button"
						className="btn"
						type="submit"
					>
						SAVE
					</button>
				</form>
			</div>
		);
	}
}
