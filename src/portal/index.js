import React, { Component } from "react";
import Login from "./Login";
import Register from "./Register";

// import { graphql, compose } from "react-apollo";
// import gql from "graphql-tag";

import swal from "sweetalert";

export default class EntryPortal extends Component {
	constructor() {
		super();

		this.state = {
			loginVisible: false,
			register: {
				fullName: "",
				password: "",
				phone: ""
			},
			login: {
				password: "",
				phone: ""
			}
		};
	}
	componentDidMount() {
		// let token = window.localStorage.getItem("ATH-TOKEN") || null;
		// if(token !== null){
		// 	this.props.history.push('/app');
		// }
	}
	componentWillUpdate() {
		// let token = window.localStorage.getItem("ATH-TOKEN") || null;
		// if(token !== null){
		// 	this.props.history.push('/app');
		// }
	}
	updateRegisterInfo = user => {
		this.setState({
			register: {
				fullName: user.fullName,
				password: user.password,
				phone: user.phone
			}
		});
	};
	updateLoginInfo = user => {
		this.setState({
			login: {
				password: user.password,
				phone: user.phone
			}
		});
	};
	togglePortal = () => {
		this.setState({
			loginVisible: !this.state.loginVisible
		});
	};
	tryLogin = async () => {
		if (!this.validate(this.state.login)) {
			return false;
		}

		const phone = this.state.login.phone,
			password = this.state.login.password;

		try {
			let res = await this.props.loginMutation({
				variables: {
					phone,
					password
				}
			});
			// Show Loading
			console.log(res);
			localStorage.setItem(
				"ATH-TOKEN",
				res.data.loginWithCredentials.token
			);
			this.props.updateToken(res.data.loginWithCredentials.token);
		} catch (err) {
			swal("Sorry!", "This user doesn't seem to exist", "error");
			console.log(err);
			return false;
		}
	};

	validate = obj => {
		for (let prop in obj) {
			if (obj[prop] === "") {
				swal("Error", "Please complete all fields.", "error");
				return false;
			}
			if (prop === "phone" && isNaN(parseInt(obj[prop], 10))) {
				swal(
					"Error",
					"Please provide a valid phone number. \n (example: 1-234-567-8910 would be entered as 12345678910)",
					"error"
				);
				return false;
			}
			if (obj["password"].length < 6) {
				swal(
					"Error",
					"Password must be at least 3 characters.",
					"error"
				);
				return false;
			}
			if (prop === "fullName" && !obj["fullName"].includes(" ")) {
				swal(
					"Error",
					'Please include a first and last name (or middle name). \n (example: "Zapp Brannigan" or "Phillip J." )',
					"error"
				);
				return false;
			}
			if (
				prop !== "password" &&
				new RegExp(
					/\.|,|\/|!|@|#|\$|%|\^|&|\*|\(|\||"|'|;|:|<|>|\?|`|~|\[|\]|\{|\}/
				).test(obj[prop])
			) {
				swal(
					"Error",
					"Name cannot contain special characters.",
					"error"
				);
				return false;
			}
		}
		return true;
	};

	tryRegister = async () => {
		if (!this.validate(this.state.register)) {
			return false;
		}

		const fullName = this.state.register.fullName,
			phone = this.state.register.phone,
			password = this.state.register.password;

		try {
			let res = await this.props.registerMutation({
				variables: {
					fullName,
					phone,
					password
				}
			});
			// show loading
			localStorage.setItem("ATH-TOKEN", res.data.createUser.token);
			this.props.updateToken(res.data.createUser.token);
		} catch (err) {
			swal("Sorry!", "This phone number has been taken", "error");
			console.log(err);
			return false;
		}
	};
	render() {
		return (
			<div className="wrapper" id="entry-portal">
				<div id="portal-wrapper">
					<div id="portal-header">
						<img
							src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-logo-small-white.png"
							id="portal-logo"
							alt="logo"
						/>
						<img
							src="https://s3.us-east-2.amazonaws.com/athares-images/Athares-full-small-white.png"
							id="portal-brand"
							alt="brand"
						/>
					</div>
					{this.state.loginVisible ? (
						<Login
							login={this.state.login}
							updateInfo={this.updateLoginInfo}
							togglePortal={this.togglePortal}
							tryLogin={this.tryLogin}
						/>
					) : (
						<Register
							register={this.state.register}
							updateInfo={this.updateRegisterInfo}
							togglePortal={this.togglePortal}
							tryRegister={this.tryRegister}
						/>
					)}
				</div>
			</div>
		);
	}
}

// const registerMutation = gql`
// mutation registerMutation($fullName: String!, $password: String!, $phone: String!){
// 	createUser(fullName: $fullName, password: $password, phone: $phone){
// 		token
// 	}
// }
// `;

// const loginMutation = gql`
// mutation loginMutation($phone: String!, $password: String!){
// 	loginWithCredentials(phone: $phone, password: $password){
// 		token
// 	}
// }
// `;

// export default compose(
// 	graphql(registerMutation, {name: "registerMutation"}),
// 	graphql(loginMutation, {name: "loginMutation"})
// 	)(EntryPortal)
