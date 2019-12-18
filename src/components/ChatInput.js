import React, { PureComponent } from "react";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";
import Loader from "./Loader";
// import emojer from "emojer";
// import EXIF from "exif-js";
import { Picker } from "emoji-mart";
var loadImage = require("blueimp-load-image-npm");

export default class ChatInput extends PureComponent {
  constructor() {
    super();

    this.state = {
      input: "",
      showFilePreview: false,
      file: null,
      fileIsImage: false,
      loadingImage: false,
      showEmoji: false,
      rotate: 0,
      extension: null,
      filePreview: null
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
    if (this.state.input.trim() === "" && chatInput.value.trim() === "") {
      return false;
    }
    this.setState({ input: chatInput.value });
  };
  toggleEmoji = e => {
    this.setState({
      showEmoji: !this.state.showEmoji
    });
  };

  submitHandler = e => {
    if (e.key !== "Enter") {
      return false;
    }
    let mobile = window.innerWidth < 993;

    if (e.shiftKey === false && mobile === false) {
      if (this.state.input.trim() === "" && this.state.file === null) {
        return false;
      }
      this.submit();
      return;
    }
    if (e.shiftKey === true && mobile === false) {
      console.log("desktop and using shift", e.shiftKey);
      return false;
    }

    if (mobile === true) {
      return false;
    }

    this.submit();
  };
  submit = async () => {
    if (this.state.input.trim() === "" && this.state.file === null) {
      return false;
    }
    // send the message to parent
    let realFile = document.getElementById("fileTextUpload").files[0];
    this.props.submit(this.state.input, realFile);
    await this.setState({
      input: "",
      showFilePreview: false,
      file: null,
      filePreview: null,
      fileIsImage: false,
      loadingImage: false
    });
    document.getElementById("fileTextUpload").value = "";

    let chatInput = document.getElementById("chat-input");
    chatInput.focus();
    chatInput.value = "";
    console.log(this.state);
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
          className="mw4 mr2"
          style={{ transform: this.state.rotate }}
          src={this.state.filePreview}
          alt={this.state.file.name}
        />
      );
    } else {
      return <FeatherIcon icon="file-text" />;
    }
  };

  // dataURItoBlob = dataURI => {
  //   var binary = atob(dataURI.split(',')[1]);
  //   var array = [];
  //   for (var i = 0; i < binary.length; i++) {
  //     array.push(binary.charCodeAt(i));
  //   }
  //   return new Blob([new Uint8Array(array)], { type: 'image/jpg' });
  // };
  getImagePreview = async () => {
    let { file } = this.state;
    let that = this;
    loadImage.parseMetaData(file, function(data) {
      let ori = 0;
      if (data.exif) {
        ori = data.exif.get("Orientation");
      }
      loadImage(
        file,
        function(img) {
          img.toBlob(blob => {
            blob.name = file.name;
            let reader = new FileReader();
            reader.onloadend = e => {
              that.setState({
                loadingImage: false,
                filePreview: reader.result,
                file: blob
              });
            };
            reader.readAsDataURL(blob);
          });
        },
        {
          meta: true,
          canvas: true,
          orientation: ori,
          maxWidth: 600
        }
      );
    });
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
    let mobile = window.innerWidth < 993;
    let width = mobile ? "100%" : "300px";
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
        <div className="flex flex-row items-start justify-start">
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
          </div>
          <TextareaAutosize
            rows={1}
            maxRows={10}
            id="chat-input"
            value={this.state.input}
            placeholder="Enter Message"
            onKeyDown={this.submitHandler}
            onChange={this.changeText}
            tabIndex="1"
            // style={{ minHeight: "10vh", maxHeight: "30vh", height: "auto" }}
          />
          {window.innerWidth < 993 && (
            <div
              id="chat-util-icons"
              className="mobile-chat-bar"
              style={{ width: "3em" }}
            >
              <div className="chat-util-icon" onClick={this.submit}>
                <FeatherIcon icon="send" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
