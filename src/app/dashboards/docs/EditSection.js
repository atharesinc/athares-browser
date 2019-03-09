import React from "react";
import FeatherIcon from "feather-icons-react";

const EditSection = ({ cancel, save, repeal }) => {
  return (
    <div className="edit-section-bar">
      <div className="column-center toolbar-item" onClick={save}>
        <FeatherIcon className="save-changes" icon="check" />
        <div className="save-changes" style={{ fontSize: "0.75em" }}>
          SAVE
        </div>
      </div>
      <div className="column-center toolbar-item" onClick={repeal}>
        <FeatherIcon className="save-changes" icon="trash-2" />
        <div className="save-changes" style={{ fontSize: "0.75em" }}>
          REPEAL
        </div>
      </div>
      <div className="column-center toolbar-item" onClick={cancel}>
        <FeatherIcon className="save-changes" icon="x" />
        <div className="save-changes" style={{ fontSize: "0.75em" }}>
          CANCEL
        </div>
      </div>
    </div>
  );
};

export default EditSection;
