import React from "react";
import { parseDate } from "../utils/transform";
import FileMessage from "./FileMessage";
import ImageMessage from "./ImageMessage";

const Message = ({ text = "", file = null, fileName = null, ...props }) => {
  const timestamp = parseDate(props.timestamp, "h:mm bbbb");

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
  const onlyEmojiStyle = () => {
    if (/([\uD800-\uDBFF][\uDC00-\uDFFF])/g.test(text)) {
      return {
        marginTop: "0em",
        background: "none",
        borderColor: "transparent",
        fontSize: "2em",
        padding: "0"
      };
    }
    return {};
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
                marginTop: file && text !== "" ? "0.5em" : "0em",
                ...onlyEmojiStyle()
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
