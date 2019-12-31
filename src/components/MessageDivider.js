import React from "react";

export default function MessageDivider({ date }) {
  return (
    <div className="message-divider-wrapper">
      <div className="message-divider-line">&nbsp;</div>
      <div className={"message-divider-content"}>{date}</div>
      <div className="message-divider-line">&nbsp;</div>
    </div>
  );
}
