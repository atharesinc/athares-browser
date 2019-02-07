import React, { PureComponent } from "react";
import TextareaAutosize from "react-autosize-textarea";
import FeatherIcon from "feather-icons-react";

export default class ChatInput extends PureComponent {
  constructor() {
    super();

    this.state = {
      input: ""
    };
    this.submit = this.submit;
    this.changeText = this.changeText;
  }
  changeText = () => {
    let chatInput = document.getElementById("chat-input");
    this.setState({ input: chatInput.value });
  };
  submit = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (this.state.input.trim() !== "") {
        this.props.submit(this.state.input);
        this.setState({ input: "" });
      }
    }
  };
  render() {
    return (
      <div id="chat-input-wrapper">
        <TextareaAutosize
          rows={1}
          maxRows={5}
          id="chat-input"
          value={this.state.input}
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
