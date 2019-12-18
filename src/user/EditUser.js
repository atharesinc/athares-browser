import React, { Component } from "react";
import ImageUpload from "../components/imageUpload";
import ErrorSwap from "../utils/ErrorSwap";
import Phone from "react-phone-number-input";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import { Link, withRouter } from "react-router-dom";
import Loader from "../components/Loader";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";
import { hideLoading } from "react-redux-loading-bar";
import { UPDATE_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";
import { uploadToAWS } from "utils/upload";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      icon: "",
      phone: "",
      firstName: "",
      lastName: "",
      uname: "",
      phoneTaken: false,
      unameTaken: false,
      loading: true,
      editMode: false,
      hasEditedImage: false
    };
  }
  async componentDidMount() {
    if (!this.props.userId) {
      this.props.history.replace("/app");
    }
    this.props.dispatch(hideLoading());
    await this.setState({
      ...this.props.user,
      loading: false
    });
  }
  componentWillUnmount() {
    this.props.dispatch(hideLoading());
  }
  editMode = bool => {
    this.setState({
      editMode: bool,
      hasEditedImage: true
    });
  };
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
      uname: e.target.value.substring(0, 100),
      unameTaken: false
    });
  };
  updatePhone = number => {
    this.setState({
      phone: number,
      phoneTaken: false
    });
  };
  convertBlobToBase64 = blob => {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        resolve(reader.result);
      };
    });
  };
  b64toBlob = (b64Data, sliceSize = 512) => {
    const block = b64Data.split(";");
    // get the real base64 content of the file
    const realData = block[1].split(",")[1];
    const byteCharacters = atob(realData);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: "image/png" });
  };
  onSubmit = async e => {
    e.preventDefault();
    if (this.state.editMode) {
      return false;
    }
    await this.setState({ loading: true });

    // validate user data
    // ???

    try {
      // create circle
      let updatedUser = {
        firstName: this.state.firstName || "",
        lastName: this.state.lastName || "",
        phone: this.state.phone || "",
        uname: this.state.uname || "",
        icon: this.props.user.icon
      };
      console.log(updatedUser);

      // only update the image if the user has updated it
      if (this.state.hasEditedImage) {
        let base64Large = this.state.icon;

        // Depending on whether or not the user updates their image, the photo can be either base64 or a Blob
        if (this.state.icon instanceof Blob) {
          base64Large = await this.convertBlobToBase64(base64Large);
        }
        // create a reasonable image from whatever was uploaded
        let base64Small = await this.shrinkBase64(base64Large);

        // finally create a file to be uploaded to aws or wherever
        const finalImage = this.b64toBlob(base64Small);

        let { url } = await uploadToAWS(finalImage);

        updatedUser.icon = url;
      }
      // Update the user by merging in changes

      await this.props.updateUser({
        variables: {
          id: this.props.userId,
          ...updatedUser
        }
      });

      await this.setState({
        loading: false,
        phoneTaken: false,
        unameTaken: false
      });

      this.props.history.push("/app/user");
    } catch (err) {
      console.error(new Error(err));
      this.setState({
        loading: false
      });
    }
  };
  shrinkBase64 = base64String => {
    return new Promise(resolve => {
      var img = document.createElement("img");
      img.crossOrigin = "anonymous";
      img.onload = function() {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width = 200;
        canvas.height = 200;

        ctx.drawImage(this, 0, 0, 200, 200);

        resolve(canvas.toDataURL("image/png"));
      };

      img.src = base64String;
    });
  };
  clearError = () => {
    this.setState({
      phoneTaken: false,
      unameTaken: false
    });
  };
  render() {
    if (this.state.loading || this.state.id === null) {
      return (
        <div
          id="dashboard-wrapper"
          style={{
            justifyContent: "center"
          }}
          className="pa2"
        >
          <Loader />
          <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Loading...</h1>
        </div>
      );
    }
    return (
      <div id="dashboard-wrapper">
        <form
          className="pa2 pa4-ns white wrapper"
          onSubmit={this.onSubmit}
          id="update-user-form"
        >
          <article className="cf">
            <div
              className="w-100 row-center"
              style={{
                justifyContent: "space-between",
                flexDirection: "row"
              }}
            >
              <Link
                className="f6 link dim br-pill ba bw1 ph3 pv2 dib white"
                to="/app/user"
              >
                BACK
              </Link>
              <h1 className="mv0 lh-title">Edit Info</h1>
            </div>
            <Scrollbars
              style={{ width: "100%", height: "80vh" }}
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={200}
              universal={true}
            >
              <header className="fn fl-ns w-50-ns pr4-ns">
                <ImageUpload
                  onSet={this.changeImage}
                  defaultImage={this.state.icon}
                  editMode={this.editMode}
                />
                <small id="name-desc" className="f6 white-80 db mb2">
                  Your profile picture will be cropped as a circle. It is
                  recommended you upload a square photo with dimensions around
                  250x250 pixels.
                </small>
              </header>
              <div className="fn fl-ns w-50-ns mt4">
                <div className="row-center">
                  <div className="w-50 mb4">
                    <label htmlFor="firstName" className="f6 b db mb2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      className="input-reset ba pa2 mb2 db ghost w-90"
                      type="text"
                      aria-describedby="name-desc"
                      required
                      value={this.state.firstName || ""}
                      onChange={this.updateFirstName}
                    />
                  </div>
                  <div className="w-50 mb4">
                    <label htmlFor="lastName" className="f6 b db mb2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      className="input-reset ba pa2 mb2 db ghost w-100"
                      type="text"
                      aria-describedby="edit-last-name"
                      required
                      value={this.state.lastName || ""}
                      onChange={this.updateLastName}
                    />
                  </div>
                </div>
                <div className="measure mb4">
                  <label htmlFor="name" className="f6 b db mb2">
                    Phone Number
                  </label>
                  <Phone
                    placeholder="+1 123 456 7890"
                    value={this.state.phone || ""}
                    country="US"
                    inputClassName="db w-100 ghost pa2"
                    aria-describedby="name-desc"
                    displayInitialValueAsLocalNumber={true}
                    onChange={this.updatePhone}
                    nativeCountrySelect
                    className="mv2"
                  />
                  <ErrorSwap
                    condition={!this.state.phoneTaken}
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        Your phone number is used for multi-factor
                        authentication. This number must be unique.
                      </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        This number has already been taken.
                      </small>
                    }
                  />
                </div>
                {/*<div className="measure mb4">
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
							</div>*/}
                <div className="measure mb4">
                  <label htmlFor="uname" className="f6 b db mb2">
                    Unique Name
                  </label>
                  <input
                    id="uname"
                    className="input-reset ba pa2 mb2 db w-100 ghost"
                    type="text"
                    aria-describedby="name-desc"
                    placeholder="firstname.lastname"
                    value={this.state.uname || ""}
                    onChange={this.updateUsername}
                  />
                  <ErrorSwap
                    condition={!this.state.unameTaken}
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        This is a human-readable way to uniquely identify each
                        user. This name must be unique.
                      </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        Sorry! This name has already been taken.
                      </small>
                    }
                  />
                </div>
              </div>
            </Scrollbars>
          </article>

          {!this.state.editMode && (
            <button id="create-circle-button" className="btn" type="submit">
              SAVE
            </button>
          )}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: pull(state, "user")
  };
}
export default graphql(UPDATE_USER, { name: "updateUser" })(
  withRouter(connect(mapStateToProps)(EditUser))
);
