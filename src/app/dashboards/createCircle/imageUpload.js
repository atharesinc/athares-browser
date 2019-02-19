import React from "react";
import ReactAvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import Loader from "../../../components/Loader";
import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";
import EXIF from "exif-js";
import swal from "sweetalert";

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.defaultImage,
      width:
        parseFloat(getComputedStyle(document.getElementById("root")).fontSize) *
        15,
      height:
        parseFloat(getComputedStyle(document.getElementById("root")).fontSize) *
        15,
      editMode: false,
      finalImage: this.props.defaultImage,
      loading: false,
      scale: 1,
      rotate: 0
    };
  }
  componentDidUpdate() {
    // if (this.state.editMode) {
    //  console.log(document.getElementById("create-circle-editor"));
    //  this.draw();
    // }
  }
  handleDrop = dropped => {
    this.setState({ image: dropped[0] });
  };
  toggleEdit = () => {
    if (this.props.editMode) {
      this.props.editMode(!this.state.editMode);
    }
    this.setState({ editMode: !this.state.editMode });
  };
  rotate = (angle = 90) => {};
  onClickSave = async () => {
    try {
      if (this.editor) {
        // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
        // drawn on another canvas, or added to the DOM.
        let canvas = this.editor.getImage().toDataURL("image/jpg");
        // console.log(canvas);
        let imageURL;
        await fetch(canvas)
          .then(res => res.blob())
          .then(blob => (imageURL = window.URL.createObjectURL(blob)));
        let blob = this.dataURItoBlob(canvas);

        this.setState(
          { finalImage: imageURL, editMode: false, loading: false },
          () => {
            this.props.onSet(blob);
            this.props.editMode(false);
          }
        );
        // If you want the image resized to the canvas size (also a HTMLCanvasElement)
        // const canvasScaled = this.editor.getImageScaledToCanvas();
      }
    } catch (err) {
      throw new Error(err);
    }
  };
  dataURItoBlob = dataURI => {
    var binary = atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: "image/jpg" });
  };
  isValidFile = fileType => {
    console.log(fileType);
    const type = /\/(.+)$/.exec(fileType)[1];

    const switcher = {
      jpeg: true,
      png: true,
      gif: true
    };

    return switcher[type] === true;
  };

  onChange = () => {
    let file = document.getElementById("imgFile").files[0];
    if (!this.isValidFile(file.type)) {
      swal(
        "Error",
        "Please use a valid file type such as .jpeg or .png",
        "error"
      );
      return false;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    this.setState({ loading: true });
    reader.onloadend = e => {
      EXIF.getData(file, () => {
        var orientation = EXIF.getTag(this, "Orientation");
        let rotatePic = 0;
        switch (orientation) {
          case 8:
            rotatePic = 270;
            break;
          case 6:
            rotatePic = 90;
            break;
          case 3:
            rotatePic = 180;
            break;
          default:
            rotatePic = 0;
        }
        this.setState({
          loading: false,
          image: reader.result,
          rotate: rotatePic
        });
      });
    };
  };
  sliderChange = pos => {
    this.setState({
      scale: 1 + pos / 100
    });
  };
  setEditorRef = editor => (this.editor = editor);
  render() {
    let tempImage = this.state.image;

    if (!this.state.editMode) {
      return (
        <div className="mv4">
          <div
            style={{
              border: "5px solid #FFFFFF",
              height: this.state.height,
              width: this.state.width,
              borderRadius: "2px"
            }}
            className="row-center"
          >
            {/*<img
                          src={this.state.finalImage}
                          style={{
                            height: "100%"
                            // width: "100%"
                          }}
                          alt="icon"
                          crossOrigin="Anonymous"
                        /> */}
            <div
              style={{
                background: `url(${this.state.finalImage}) center no-repeat`,
                backgroundSize: "cover",
                height: "100%",
                minWidth: "100%"
              }}
            />
          </div>
          <div
            className="btn mv2 tc"
            style={{ width: this.state.width / 2 - 10 }}
            onClick={this.toggleEdit}
          >
            Edit Icon
          </div>
        </div>
      );
    }
    if (this.state.loading) {
      return (
        <div className="mv4">
          <div
            className="horizontal"
            style={{
              border: "5px solid #FFFFFF",
              height: this.state.height,
              width: this.state.width,
              borderRadius: "2px",
              justifyContent: "center"
            }}
          >
            <Loader />
          </div>
        </div>
      );
    }
    return (
      <div className="mv4">
        <div>
          <Dropzone
            onDrop={this.handleDrop}
            multiple={false}
            accept={"image/*"}
            disableClick
            width={this.state.width}
            height={this.state.height}
            id="create-circle-dropzone"
            style={{
              border: "5px solid #FFFFFF",
              height: this.state.height,
              width: this.state.width,
              borderRadius: "2px"
            }}
          >
            <ReactAvatarEditor
              width={this.state.width - 30}
              height={this.state.height - 30}
              image={tempImage}
              ref={this.setEditorRef}
              id="create-circle-editor"
              border={10}
              scale={this.state.scale}
              crossOrigin={"anonymous"}
              rotate={this.state.rotate}
            />
          </Dropzone>
        </div>
        <Slider
          min={0}
          max={100}
          defaultValue={0}
          onChange={this.sliderChange}
          className="mv3"
          style={{ width: this.state.width }}
        />
        {/*<div
                  className="flex flex-row space-around"
                  style={{ width: this.state.width }}
                >
                  <FeatherIcon
                    icon="rotate-ccw"
                    className="ghost w-50"
                    onClick={this.rotate(-90)}
                  />
                  <FeatherIcon
                    icon="rotate-cw"
                    className="ghost w-50"
                    onClick={this.rotate(90)}
                  />
                </div>*/}
        <input
          type="file"
          name="file"
          id="imgFile"
          accept=".jpeg,.jpg,.png,.gif"
          onChange={this.onChange}
        />
        <div className="horizontal">
          <label htmlFor="imgFile">
            <div className="btn mv2 tc" style={{ width: this.state.width / 2 }}>
              New
            </div>
          </label>

          <div
            className="btn mv2 tc"
            style={{ width: this.state.width / 2 }}
            onClick={this.onClickSave}
          >
            Set
          </div>
        </div>
        <small id="comment-desc" className="f6 white-80">
          Drag and drop or press "New" to change the image.
        </small>
      </div>
    );
  }
}
