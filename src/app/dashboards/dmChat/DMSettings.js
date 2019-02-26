import React, { Component } from "react";
import { pull } from "../../../store/state/reducers";
import { connect } from "react-redux";
import FeatherIcon from "feather-icons-react";
import { closeDMSettings } from "../../../store/ui/actions";
import LeaveDM from "./LeaveDM";
import AddUserToDM from "./AddUserToDM";
import Scrollbars from "react-custom-scrollbars";
class DMSettings extends Component {
  close = () => {
    this.props.dispatch(closeDMSettings());
  };
  render() {
    return (
      <div
        id="dm-settings"
        className="h-100 w-30 bl b--white-70 bg-theme flex flex-column justify-start items-stretch slideInFromRight"
      >
        <div id="current-dm-channel" className="pa2">
          <div>Settings</div>
          <FeatherIcon icon="x" onClick={this.close} className="pointer" />
        </div>
        {/* Various Settings */}
        <Scrollbars style={{ width: "100vw", height: "90vh" }}>
          <AddUserToDM />
          <LeaveDM />
        </Scrollbars>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeChannel: pull(state, "activeChannel")
  };
}
export default connect(mapStateToProps)(DMSettings);
