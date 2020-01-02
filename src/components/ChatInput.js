import React, { useState, useEffect, useCallback } from "reactn";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";
import Loader from "./Loader";
// import emojer from "emojer";
// import EXIF from "exif-js";
import { Picker } from "emoji-mart";
var loadImage = require("blueimp-load-image-npm");

export default function ChatInput(props) {
  const [input, setInput] = useState("");
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [file, setFile] = useState(null);
  const [fileIsImage, setFileIsImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [rotate] = useState(0);
  // const [extension, setExtension] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const hideEmojis = useCallback(
    e => {
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
    },
    [showEmoji]
  );

  useEffect(() => {
    window.addEventListener("click", hideEmojis);
    return () => {
      window.removeEventListener("click", hideEmojis);
    };
  }, [hideEmojis]);

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
    let newFile = e.currentTarget.files[0];
    let extension = newFile.name.match(/\.(.{1,4})$/i)[1];

    if (
      newFile.type.includes("image/") &&
      imgs.findIndex(i => i === extension.toLowerCase()) !== -1
    ) {
      setFileIsImage(true);
      setShowFilePreview(true);
      setFile(newFile);
      setLoadingImage(true);
      getImagePreview(newFile);
    } else {
      setFileIsImage(false);
      setShowFilePreview(true);
      setFile(newFile);
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
  const getImagePreview = async newFile => {
    loadImage.parseMetaData(newFile, function(data) {
      let ori = 0;
      if (data.exif) {
        ori = data.exif.get("Orientation");
      }
      loadImage(
        newFile,
        function(img) {
          img.toBlob(blob => {
            blob.name = newFile.name;
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
  // const deleteImage = () => {
  //   setShowFilePreview(false);
  //   setFile(null);
  //   setFileIsImage(false);
  // };

  const selectEmoji = emoji => {
    setInput(input + emoji.native);
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
