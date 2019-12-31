import React from "react";
import moment from "moment";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";

const Message = ({ text = "", file = null, fileName = null, ...props }) => {
  const timestamp = moment(props.timestamp).format("h:mma");
  // props.timestamp.substring(0, 10) === moment().format("YYYY-MM-DD")
  //   ? "Today " + moment(props.timestamp).format("h:mma")
  //   : moment(props.timestamp).format("h:mma");

  const isImage = (file, fileName) => {
    const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];

    let extension = fileName.match(/\.(.{1,4})$/i)
      ? fileName.match(/\.(.{1,4})$/i)[1]
      : "";

    if (imgs.findIndex(i => i === extension.toLowerCase()) !== -1) {
      return <ImageMessage file={file} fileName={fileName} />;
    } else {
      return <FileMessage file={file} fileName={fileName} />;
    }
  };
  return (
    <div className="message-wrapper">
      {props.multiMsg === false && (
        <div className={"flex flex-row items-baseline mb2 "}>
          <div style={{ color: "#FFFFFF" }}>{props.user.firstName}</div>
          <div className={"message-timestamp"}>{timestamp}</div>
        </div>
      )}
      <div className="message-content-wrapper">
        {props.multiMsg === false && (
          <img
            className="message-icon"
            src={props.user.icon}
            alt={props.user.firstName}
          />
        )}
        <div className="flex flex-column justify-start items-start">
          {file !== null && isImage(file, fileName)}

          {text !== "" && (
            <div
              className={`message-content ${props.isMine ? "my-msg" : ""}`}
              style={{
                marginTop: file && text !== "" ? "0.5em" : "0em"
              }}
            >
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Message;
