import React, { useState, useGlobal, useEffect } from "reactn";
import ImageUpload from "../components/ImageUpload";
import ErrorSwap from "../utils/ErrorSwap";

import Loader from "../components/Loader";
import swal from "sweetalert";
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { CREATE_CIRCLE, ADD_USER_TO_CIRCLE } from "../graphql/mutations";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import { uploadToAWS } from "utils/upload";

function CreateCircle(props) {
  // this should be whatever fits into an img src value or a css url(), either a filepath or base64 encoded image string
  const [icon, setIcon] = useState("/img/Athares-logo-large-white.png");
  const [name, setName] = useState("");
  const [preamble, setPreamble] = useState("");
  const [isTaken, setIsTaken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useGlobal("user");
  const [pub, setPub] = useGlobal("pub");
  const [, setActiveCircle] = useGlobal("activeCircle");

  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = () => {
    // verify this circle is real and that the user is logged in, but for now...
    if (!user) {
      props.history.replace("/app");
    }

    fetch(icon)
      .then(function(response) {
        return response.blob();
      })
      .then(function(blob) {
        setIcon(blob);
      });
  };

  const changeImage = imageUrl => {
    setIcon(imageUrl);
  };

  const updateName = e => {
    setName(e.target.value.substring(0, 51));
    setIsTaken(false);
  };
  const updatePreamble = e => {
    setPreamble(e.target.value);
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

  const back = () => {
    props.history.push(`/app`);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (editMode) {
      return false;
    }

    let base64Large = icon;
    // Depending on whether or not the user updates their image, the photo can be either base64 or a Blob
    if (base64Large instanceof Blob) {
      base64Large = await convertBlobToBase64(base64Large);
    }

    let base64Small = await shrinkBase64(base64Large);

    // finally create a file to be uploaded to aws or wherever
    const finalImage = b64toBlob(base64Small);

    let { url } = await uploadToAWS(finalImage);

    preamble = preamble.trim();
    name = name.trim();

    if (preamble === "" || name === "") {
      swal("Sorry", "Circles must have a name and preamble.", "error");
      return false;
    }
    setLoading(true);

    // create circle
    let newCircle = {
      name,
      preamble,
      icon: url
    };

    let newCircleRes = await props.createCircle({
      variables: {
        ...newCircle
      }
    });

    newCircle.id = newCircleRes.data.createCircle.id;

    await props.addCircleToUser({
      variables: {
        user,
        circle: newCircle.id
      }
    });
    // set activeCircle as this one
    setActiveCircle(newCircle.id);

    setLoading(false);
    swal("Circle Created", `${name} has been created successfully.`, "success");

    props.history.push("/app/circle/" + newCircle.id + "/constitution");
  };

  const shrinkBase64 = base64String => {
    return new Promise(resolve => {
      // We create an image to receive the Data URI
      var img = document.createElement("img");

      // When the event "onload" is triggered we can resize the image.
      img.onload = function() {
        // We create a canvas and get its context.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        // We set the dimensions at the wanted size.
        canvas.width = 200;
        canvas.height = 200;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, 200, 200);
        resolve(canvas.toDataURL("image/png"));
      };

      img.src = base64String;
    });
  };
  const clearError = () => {
    setIsTaken(false);
  };

  if (loading) {
    return (
      <div
        id="dashboard-wrapper"
        style={{
          justifyContent: "center"
        }}
        className="pa2"
      >
        <Loader />
        <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Creating Your Circle</h1>
      </div>
    );
  }
  return (
    <div id="revisions-wrapper">
      <div className="flex ph2 mobile-nav">
        <Link to="/app" className="flex justify-center items-center">
          <FeatherIcon
            icon="chevron-left"
            className="white db dn-l"
            onClick={back}
          />
        </Link>
        <h2 className="ma3 lh-title white"> Create Circle </h2>
      </div>
      <form
        className="pa2 pa4-ns white wrapper mobile-body"
        onSubmit={onSubmit}
        id="create-circle-form"
      >
        <Scrollbars style={{ height: "100%", width: "100%" }}>
          <article className="cf">
            <time className="f7 ttu tracked white-80">
              Circles are collaborative, voting-centric organizations.
            </time>
            <header className="fn fl-ns w-50-ns pr4-ns">
              <ImageUpload
                onSet={changeImage}
                defaultImage={icon}
                editMode={setEditMode}
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
                  value={name}
                  onChange={updateName}
                />
                <ErrorSwap
                  condition={!isTaken}
                  normal={
                    <small id="name-desc" className="f6 white-80 db mb2">
                      This name must be unique.
                    </small>
                  }
                  error={
                    <small id="name-desc" className="f6 red db mb2">
                      Sorry! This name has already been taken.
                    </small>
                  }
                />
              </div>
              <div className="mv4">
                <label htmlFor="comment" className="f6 b db mb2">
                  Preamble
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  className="db border-box w-100 measure ba pa2 mb2 ghost"
                  aria-describedby="comment-desc"
                  resize="false"
                  required
                  value={preamble}
                  onChange={updatePreamble}
                />
                <small id="comment-desc" className="f6 white-80">
                  Describe your government in a few sentences. This will be
                  visible at the top of the Constitution and outlines the basic
                  vision of this government.
                </small>
              </div>
            </div>
          </article>
          <div id="comment-desc" className="f6 white-80">
            By pressing "Create Circle" you will create a new government with a
            the above name, preamble, and the selected image.
          </div>
          {!editMode && (
            <button id="create-circle-button" className="btn mt4" type="submit">
              Create Circle
            </button>
          )}
        </Scrollbars>
      </form>
    </div>
  );
}

export default compose(
  graphql(CREATE_CIRCLE, { name: "createCircle" }),
  graphql(ADD_USER_TO_CIRCLE, { name: "addCircleToUser" })
)(CreateCircle);
