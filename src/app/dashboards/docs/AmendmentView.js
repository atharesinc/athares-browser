import React from "react";
import FeatherIcon from "feather-icons-react";
import moment from "moment";

const AmendmentView = ({ amendment, toggleEdit, editable }) => {
  return (
    <div className="amendment-wrapper mb4" id={amendment.id}>
      {editable && (
        <div className="amendment-icon-wrapper" onClick={toggleEdit}>
          <FeatherIcon className="amendment-icon" icon="edit" />
          <div className="amendment-icon">EDIT</div>
        </div>
      )}
      <div style={{ width: "100%" }}>
        <div className="f4 bb b--white-30 pb2 amendment-title">
          <div className="mb2">{amendment.title}</div>
          <div className="f7 white-70 flex flex-row justify-start items-center">
            <div className="mb1 w-50">
              Created - {moment(amendment.createdAt).format("MM/DD/YY hh:mma")}
            </div>
            <div className="w-50">
              Updated - {moment(amendment.updatedAt).format("MM/DD/YY hh:mma")}
            </div>
          </div>
        </div>
        <div data-id={amendment.id} className={`f6 mv3 amendment-text`}>
          {amendment.text}
        </div>
      </div>
    </div>
  );
};

export default AmendmentView;
