import React, { useGlobal } from "reactn";

import FeatherIcon from "feather-icons-react";
import LeaveDM from "./LeaveDM";
import AddUserToDM from "./AddUserToDM";
import Scrollbars from "react-custom-scrollbars";

function DMSettings(props) {
  const [, setDmSettings] = useGlobal("dmSettings");

  const closeSettings = () => {
    setDmSettings(false);
  };

  return (
    <div
      id="dm-settings"
      className="h-100 w-30 bl b--white-70 bg-theme flex flex-column justify-start items-stretch slideInFromRight"
    >
      <div id="current-dm-channel" className="pa2">
        <div>Settings</div>
        <FeatherIcon icon="x" onClick={closeSettings} className="pointer" />
      </div>
      {/* Various Settings */}
      <Scrollbars style={{ width: "100%", height: "90vh" }}>
        <AddUserToDM />
        <LeaveDM />
      </Scrollbars>
    </div>
  );
}

export default DMSettings;
