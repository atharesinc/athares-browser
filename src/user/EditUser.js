import React, { useState, useGlobal, useEffect } from "reactn";
import ImageUpload from "../components/ImageUpload";
import ErrorSwap from "../utils/ErrorSwap";
import Phone from "react-phone-number-input";
import "react-phone-number-input/rrui.css";
import "react-phone-number-input/style.css";
import { Link, withRouter } from "react-router-dom";
import Loader from "../components/Loader";
import { Scrollbars } from "react-custom-scrollbars";

import { hideLoading } from "react-redux-loading-bar";
import { UPDATE_USER } from "../graphql/mutations";
import { graphql } from "react-apollo";
import { uploadToAWS } from "utils/upload";

function EditUser(props) {
  const [userState, setUserState] = useState({
    id: null,
    icon: "",
    phone: "",
    firstName: "",
    lastName: "",
    uname: ""
  });

  const [phoneTaken, setPhoneTaken] = useState(false);
  const [unameTaken, setUnameTaken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [hasEditedImage, setHasEditedImage] = useState(false);
  const [user] = useGlobal("user");

  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = async () => {
    if (!user) {
      props.history.replace("/app");
    }
    setUserState(props.user);
    setLoading(false);
  };

  const toggleEditMode = bool => {
    setEditMode(bool);
    setHasEditedImage(true);
  };
  const changeImage = imageUrl => {
    setUserState({
      ...userState,
      icon: imageUrl
    });
  };

  const updateFirstName = e => {
    setUserState({
      ...userState,
      firstName: e.target.value.substring(0, 51)
    });
  };
  const updateLastName = e => {
    setUserState({
      ...userState,
      lastName: e.target.value.substring(0, 51)
    });
  };
  const updateUsername = e => {
    setUserState({
      ...userState,
      uname: e.target.value.substring(0, 100)
    });

    setUnameTaken(false);
  };
  const updatePhone = number => {
    setUserState({
      phone: number
    });
    setPhoneTaken(false);
  };
  const convertBlobToBase64 = blob => {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        resolve(reader.result);
      };
    });
  };
  const b64toBlob = (b64Data, sliceSize = 512) => {
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
  const onSubmit = async e => {
    e.preventDefault();
    if (editMode) {
      return false;
    }
    setLoading(true);

    // validate user data
    // ???

    const [firstName, lastName, phone, uname, icon] = userState;

    try {
      let updatedUser = {
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || "",
        uname: uname || "",
        icon: props.user.icon
      };

      // only update the image if the user has updated it
      if (hasEditedImage) {
        let base64Large = icon;

        // Depending on whether or not the user updates their image, the photo can be either base64 or a Blob
        if (icon instanceof Blob) {
          base64Large = await convertBlobToBase64(base64Large);
        }
        // create a reasonable image from whatever was uploaded
        let base64Small = await shrinkBase64(base64Large);

        // finally create a file to be uploaded to aws or wherever
        const finalImage = b64toBlob(base64Small);

        let { url } = await uploadToAWS(finalImage);

        updatedUser.icon = url;
      }

      // Update the user by merging in changes
      await props.updateUser({
        variables: {
          id: user,
          ...updatedUser
        }
      });

      setLoading(false);
      setPhoneTaken(false);
      setUnameTaken(false);

      props.history.push("/app/user");
    } catch (err) {
      console.error(new Error(err));
      setLoading(false);
    }
  };

  const shrinkBase64 = base64String => {
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

  const clearError = () => {
    setPhoneTaken(false);
    setUnameTaken(false);
  };

  const { id, firstName, lastName, phone, uname, icon } = userState;

  if (loading || id === null) {
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
        onSubmit={onSubmit}
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
                onSet={changeImage}
                defaultImage={icon}
                editMode={toggleEditMode}
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
                    value={firstName || ""}
                    onChange={updateFirstName}
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
                    value={lastName || ""}
                    onChange={updateLastName}
                  />
                </div>
              </div>
              <div className="measure mb4">
                <label htmlFor="name" className="f6 b db mb2">
                  Phone Number
                </label>
                <Phone
                  placeholder="+1 123 456 7890"
                  value={phone || ""}
                  country="US"
                  inputClassName="db w-100 ghost pa2"
                  aria-describedby="name-desc"
                  displayInitialValueAsLocalNumber={true}
                  onChange={updatePhone}
                  nativeCountrySelect
                  className="mv2"
                />
                <ErrorSwap
                  condition={!phoneTaken}
                  normal={
                    <small id="name-desc" className="f6 white-80 db mb2">
                      Your phone number is used for multi-factor authentication.
                      This number must be unique.
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
									value={email}
									onChange={updateEmail}
								/>
								<ErrorSwap
									condition={!emailTaken}
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
                  value={uname || ""}
                  onChange={updateUsername}
                />
                <ErrorSwap
                  condition={!unameTaken}
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

        {!editMode && (
          <button id="create-circle-button" className="btn" type="submit">
            SAVE
          </button>
        )}
      </form>
    </div>
  );
}

export default graphql(UPDATE_USER, { name: "updateUser" })(
  withRouter(EditUser)
);
