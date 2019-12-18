import React, { useState } from "reactn";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";
import Loader from "./Loader";
// import emojer from "emojer";
// import EXIF from "exif-js";
import { Picker } from "emoji-mart";
var loadImage = require("blueimp-load-image-npm");

export default function ChatInput() {
  const [input] = useState("");
  const [showFilePreview] = useState(false);
  const [file] = useState(null);
  const [fileIsImage] = useState(false);
  const [loadingImage] = useState(false);
  const [showEmoji] = useState(false);
  const [rotate] = useState(0);
  const [extension] = useState(null);
  const [filePreview] = useState(null);

  useEffect(() => {
    componentMount();
    return () => {
      window.removeEventListener("click", hideEmojis);
    };
  }, []);

  const componentMount = () => {
    window.addEventListener("click", hideEmojis);
  };
  const hideEmojis = e => {
    if (showEmoji === false) {
      return;
    }
    if (e.target.closest(".emoji-mart") !== null) {
      return;
    }
    if (e.target.closest("#emoji-trigger") !== null) {
      return;
    }
    if (e.target.closest(".emoji-mart") === null) {
      setShowEmoji(false);
    }
  };
  const changeText = () => {
    let chatInput = document.getElementById("chat-input");
    if (input.trim() === "" && chatInput.value.trim() === "") {
      return false;
    }
    setInput(chatInput.value);
  };
  const toggleEmoji = e => {
    setShowEmoji(!showEmoji);
  };

  const submitHandler = e => {
    if (e.key !== "Enter") {
      return false;
    }
    let mobile = window.innerWidth < 993;

    if (e.shiftKey === false && mobile === false) {
      if (input.trim() === "" && file === null) {
        return false;
      }
      submit();
      return;
    }
    if (e.shiftKey === true && mobile === false) {
      console.log("desktop and using shift", e.shiftKey);
      return false;
    }

    if (mobile === true) {
      return false;
    }

    submit();
  };
  const submit = async () => {
    if (input.trim() === "" && file === null) {
      return false;
    }
    // send the message to parent
    let realFile = document.getElementById("fileTextUpload").files[0];
    props.submit(input, realFile);
    setInput("");
    setShowFilePreview(false);
    setFile(null);
    setFilePreview(null);
    setFileIsImage(false);
    setLoadingImage(false);

    document.getElementById("fileTextUpload").value = "";

    let chatInput = document.getElementById("chat-input");
    chatInput.focus();
    chatInput.value = "";
  };

  const onChange = async e => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];
    let file = e.currentTarget.files[0];
    let extension = file.name.match(/\.(.{1,4})$/i)[1];

    if (
      file.type.includes("image/") &&
      imgs.findIndex(i => i === extension.toLowerCase()) !== -1
    ) {
      await setState({
        showFilePreview: true,
        file,
        fileIsImage: true,
        loadingImage: true
      });

      getImagePreview(file);
    } else {
      await setState({
        showFilePreview: true,
        file,
        fileIsImage: false
      });
    }
  };
  const shouldRenderImage = () => {
    if (fileIsImage) {
      if (loadingImage) {
        return <Loader />;
      }
      return (
        <img
          className="mw4 mr2"
          style={{ transform: rotate }}
          src={filePreview}
          alt={file.name}
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
  const getImagePreview = async () => {
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
              setLoadingImage(false);
              setFilePreview(reader.result);
              setFile(blob);
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
  const deleteImage = () => {
    setState({
      showFilePreview: false,
      file: null,
      fileIsImage: false
    });
  };
  const selectEmoji = emoji => {
    setState({
      input: input + emoji.native
    });
  };

  let mobile = window.innerWidth < 993;
  let width = mobile ? "100%" : "300px";
  return (
    <div id="chat-input-wrapper">
      {/* new stuff below */}
      {props.uploadInProgress && (
        <div
          className="w-100 flex flex-row justify-start items-center ph2 bg-theme-light openDown"
          style={{
            height: "3em",
            position: "absolute",
            bottom: "10vh"
          }}
        >
          <FeatherIcon className="spin white" icon="loader" />
          <div className="ml2 f6 white-70">{file ? file.name : "Sending"}</div>
        </div>
      )}
      {showEmoji && (
        <Picker
          native="true"
          title={""}
          showPreview={false}
          onSelect={selectEmoji}
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
          onChange={onChange}
        />
        {showFilePreview ? shouldRenderImage() : null}
        {file && <div className="ml2 f6 white-70">{file.name}</div>}
      </div>

      {/* end new stuff */}
      <div className="flex flex-row items-start justify-start">
        <div id="chat-util-icons">
          {/* This should be a smile but feather-icons-react is behind :\ */}
          <div
            className="chat-util-icon"
            id="emoji-trigger"
            onClick={toggleEmoji}
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
          value={input}
          placeholder="Enter Message"
          onKeyDown={submitHandler}
          onChange={changeText}
          tabIndex="1"
          // style={{ minHeight: "10vh", maxHeight: "30vh", height: "auto" }}
        />
        {window.innerWidth < 993 && (
          <div
            id="chat-util-icons"
            className="mobile-chat-bar"
            style={{ width: "3em" }}
          >
            <div className="chat-util-icon" onClick={submit}>
              <FeatherIcon icon="send" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
