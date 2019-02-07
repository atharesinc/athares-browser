import React, { PureComponent } from "react";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";

export default class ChatInput extends PureComponent {
  changeText = e => {
    this.props.updateText(e.currentTarget.value);
  };
  submit = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.props.submit();
    }
  };
  render() {
    return (
      <div id="chat-input-wrapper">
        <TextareaAutosize
          rows={1}
          maxRows={5}
          id="chat-input"
          value={this.props.text}
          placeholder="Enter Message"
          onKeyDown={this.submit}
          onChange={this.changeText}
        />

        {/* <div id="chat-util-icons">
                    <div className="chat-util-icon">
                        <FeatherIcon icon="at-sign" />
                    </div>
                    <div className="chat-util-icon">
                        <FeatherIcon icon="video" />
                    </div>
                    <div className="chat-util-icon">
                        <FeatherIcon icon="link" />
                    </div>
                </div> */}
      </div>
    );
  }
}
