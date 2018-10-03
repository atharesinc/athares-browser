import React from "react";
import moment from "moment";

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
    return (
        <div
            className="message-wrapper"
            style={{ alignItems: props.isMine ? "flex-end" : "flex-start" }}
        >
            {props.multiMsg === false && (
                <div style={{ color: "#FFFFFF", fontSize: "0.8em" }}>
                    {props.user.firstName + " " + props.user.lastName}
                </div>
            )}
            <div
                className="message-content-wrapper"
                style={{ flexDirection: props.isMine && "row-reverse" }}
                onClick={toggleTimestamp}
            >
                {props.multiMsg === false && (
                    <img
                        className="message-icon"
                        src={props.user.icon}
                        alt={props.user.firstName}
                    />
                )}{" "}
                <div
                    className={`message-content ${
                        props.isMine ? "my-msg" : ""
                    }`}
                >
                    {props.text}
                </div>
            </div>

            <div className={"message-timestamp dn"}>{timestamp}</div>
        </div>
    );
};
export default Message;
