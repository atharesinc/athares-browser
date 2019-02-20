import React, { PureComponent } from "react";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";
import Loader from "./Loader";
// import emojer from "emojer";
import EXIF from "exif-js";
import { Picker } from "emoji-mart";

export default class ChatInput extends PureComponent {
  constructor() {
    super();

    this.state = {
      input: "",
      showFilePreview: false,
      file: null,
      fileIsImage: false,
      loadingImage: false,
      showEmoji: false
    };
  }
  componentDidMount() {
    window.addEventListener("click", this.hideEmojis);
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.hideEmojis);
  }
  hideEmojis = e => {
    if (this.state.showEmoji === false) {
      return;
    }
    if (e.target.closest(".emoji-mart") !== null) {
      return;
    }
    if (e.target.closest("#emoji-trigger") !== null) {
      return;
    }
    if (e.target.closest(".emoji-mart") === null) {
      this.setState({
        showEmoji: false
      });
    }
  };
  changeText = () => {
    let chatInput = document.getElementById("chat-input");
    this.setState({ input: chatInput.value });
  };
  toggleEmoji = e => {
    this.setState({
      showEmoji: !this.state.showEmoji
    });
  };
  submit = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (this.state.input.trim() === "" && this.state.file === null) {
        return false;
      }
      // send the message to parent
      this.props.submit(this.state.input, this.state.file);
      this.setState({
        input: "",
        showFilePreview: false,
        file: null,
        fileIsImage: false,
        loadingImage: false
      });
      let chatInput = document.getElementById("chat-input");
      chatInput.focus();
    }
  };
  onChange = async e => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];
    let file = e.currentTarget.files[0];
    let extension = file.name.match(/\.(.{1,4})$/i)[1];
    if (
      file.type.includes("image/") &&
      imgs.findIndex(i => i === extension.toLowerCase()) !== -1
    ) {
      await this.setState({
        showFilePreview: true,
        file,
        fileIsImage: true,
        loadingImage: true
      });
      this.getImagePreview(file);
    } else {
      await this.setState({
        showFilePreview: true,
        file,
        fileIsImage: false
      });
    }
  };
  shouldRenderImage = () => {
    if (this.state.fileIsImage) {
      if (this.state.loadingImage) {
        return <Loader />;
      }
      return (
        <img
          className="h-100"
          src={this.state.filePreview}
          alt={this.state.file.name}
        />
      );
    } else {
      return <FeatherIcon icon="file" />;
    }
  };
  getImagePreview = () => {
    let { file } = this.state;
    let reader = new FileReader();
    reader.readAsDataURL(file);
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
          loadingImage: false,
          filePreview: reader.result,
          rotate: rotatePic
        });
      });
    };
  };
  deleteImage = () => {
    this.setState({
      showFilePreview: false,
      file: null,
      fileIsImage: false
    });
  };
  selectEmoji = emoji => {
    this.setState({
      input: this.state.input + emoji.native
    });
  };
  render() {
    let { showFilePreview, fileIsImage, file, showEmoji } = this.state;
    let width = window.innerWidth < 993 ? "100%" : "300px";
    return (
      <div id="chat-input-wrapper">
        {/* new stuff below */}
        {this.props.uploadInProgress && (
          <div
            className="w-100 flex flex-row justify-start items-center ph2 bg-theme-light openDown"
            style={{
              height: "3em",
              position: "absolute",
              bottom: "10vh"
            }}
          >
            <FeatherIcon className="spin white" icon="loader" />
            <div className="ml2 f6 white-70">
              {file ? file.name : "Sending"}
            </div>
          </div>
        )}
        {showEmoji && (
          <Picker
            native="true"
            title={""}
            showPreview={false}
            onSelect={this.selectEmoji}
            style={{
              width,
              position: "absolute",
              bottom: "10vh"
            }}
          />
        )}
        <div
          className="w-100 flex flex-row justify-start items-center ph2 bg-theme-light openDown"
          style={{
            height: showFilePreview ? (fileIsImage ? "5em" : "3em") : 0,
            overflow: showFilePreview ? "normal" : "hidden",
            position: "absolute",
            bottom: "10vh"
          }}
        >
          <input
            style={{ height: 0, width: 0, visibility: "hidden" }}
            type="file"
            name="file"
            id="fileTextUpload"
            onChange={this.onChange}
          />
          {showFilePreview ? this.shouldRenderImage() : null}
          {file && <div className="ml2 f6 white-70">{file.name}</div>}
        </div>

        {/* end new stuff */}
        <div className="flex flex-row items-start justify-start bt b--white-70">
          <div id="chat-util-icons">
            {/* This should be a smile but feather-icons-react is behind :\ */}
            <div
              className="chat-util-icon"
              id="emoji-trigger"
              onClick={this.toggleEmoji}
            >
              <FeatherIcon icon="star" />
            </div>
            <label htmlFor={"fileTextUpload"}>
              <div className="chat-util-icon">
                <FeatherIcon icon="paperclip" />
              </div>
            </label>
            {/* <div className="chat-util-icon">
            <FeatherIcon icon="video" />
        </div> */}
          </div>
          <TextareaAutosize
            rows={1}
            maxRows={3}
            id="chat-input"
            value={this.state.input}
            placeholder="Enter Message"
            onKeyDown={this.submit}
            onChange={this.changeText}
            tabIndex="1"
          />
        </div>
      </div>
    );
  }
}
