import React from "react";
import moment from "moment";
import FeatherIcon from "feather-icons-react";

const Message = props => {
  const timestamp =
    props.timestamp.substring(0, 10) === moment().format("YYYY-MM-DD")
      ? "Today " + moment(props.timestamp).format("h:mma")
      : moment(props.timestamp).format("dddd h:mma");

  const toggleTimestamp = e => {
    let timestampDiv = e.currentTarget.nextSibling;
    timestampDiv.className =
      "message-timestamp " +
      (timestampDiv.className.includes("dn") ? "" : "dn");
  };
  const isImage = (file, fileName) => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];

    let extension = fileName.match(/\.(.{1,4})$/i)[1];

    if (imgs.findIndex(i => i === extension.toLowerCase()) !== -1) {
      return (
        <div className="w-50 ma2 mb0">
          <img src={file} alt={fileName || "file"} />
        </div>
      );
    } else {
      return (
        <a href={file} target="_blank" rel="no-referrer-opener">
          <div
            style={{ height: "6rem", width: "5rem" }}
            className="ma2 mb0 ba bg-theme-light b--white-70 flex flex-column justify-center items-center"
          >
            <FeatherIcon icon="file-text" className="ma2" />
            <div className="f6 white-70">{fileName}</div>
          </div>
        </a>
      );
    }
  };
  return (
    <div className="message-wrapper">
      {props.multiMsg === false && !props.isMine && (
        <div style={{ color: "#FFFFFF", fontSize: "0.8em" }}>
          {props.user.firstName}
        </div>
      )}
      <div className="message-content-wrapper" onClick={toggleTimestamp}>
        {props.multiMsg === false && (
          <img
            className="message-icon"
            src={props.user.icon}
            alt={props.user.firstName}
          />
        )}{" "}
        <div className="flex flex-column justify-start items-start">
          {props.file !== null && isImage(props.file, props.fileName)}

          <div className={`message-content ${props.isMine ? "my-msg" : ""}`}>
            {props.text}
          </div>
        </div>
      </div>

      <div className={"message-timestamp dn"}>{timestamp}</div>
    </div>
  );
};
export default Message;
