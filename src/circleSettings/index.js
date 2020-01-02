import React, { useGlobal, useEffect } from "reactn";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import LeaveCircle from "./LeaveCircle";
import ShareCircle from "./ShareCircle";
import CirclePrefs from "./CirclePrefs";
import ScrollBars from "react-custom-scrollbars";

function CircleSettings(props) {
  const [user] = useGlobal("user");
  const [activeCircle] = useGlobal("activeCircle");

  useEffect(() => {
    function componentMount() {
      if (!user || !activeCircle) {
        props.history.replace("/app");
      }
    }
    componentMount();
  }, [user, activeCircle, props.history]);

  const back = () => {
    props.history.push(`/app`);
  };

  return (
    <div id="revisions-wrapper">
      <div className="flex ph2 mobile-nav">
        <Link to="/app" className="flex justify-center items-center">
          <FeatherIcon
            icon="chevron-left"
            className="white db dn-l"
            onClick={back}
          />
        </Link>
        <h2 className="ma3 lh-title white"> Settings </h2>
      </div>
      <div
        id="create-circle-form"
        className="pa2 pa4-ns white wrapper mobile-body"
      >
        <ScrollBars
          style={{ width: "100%", height: "100%" }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          universal={true}
        >
          <ShareCircle />
          <CirclePrefs user={user} activeCircle={activeCircle} />
          <LeaveCircle />
        </ScrollBars>
      </div>
    </div>
  );
}

export default CircleSettings;
