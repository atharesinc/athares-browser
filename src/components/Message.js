import React from "react";
import moment from "moment";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";

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
      return <ImageMessage file={file} fileName={fileName} />;
    } else {
      return <FileMessage file={file} fileName={fileName} />;
    }
  };
  return (
    <div
      className="message-wrapper"
      style={{ animationDelay: "0." + props.lastMessage + "s" }}
    >
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

          {props.text !== "" && (
            <div className={`message-content ${props.isMine ? "my-msg" : ""}`}>
              {props.text}
            </div>
          )}
        </div>
      </div>

      <div className={"message-timestamp dn"}>{timestamp}</div>
    </div>
  );
};
export default Message;