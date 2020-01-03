import React from "reactn";
import FeatherIcon from "feather-icons-react";
import { parseDate } from "../utils/transform";
import { Link } from "react-router-dom";

const AmendmentView = ({ amendment, toggleEdit, editable, circle }) => {
  return (
    <div className="amendment-wrapper mb4" id={amendment.id}>
      {editable &&
        (amendment.revision === null || amendment.revision.passed !== null) && (
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
              Created - {parseDate(amendment.createdAt, "P h:mm bbbb")}
            </div>
            <div className="w-50">
              Updated - {parseDate(amendment.updatedAt, "P h:mm bbbb")}
            </div>
          </div>
        </div>
        <div data-id={amendment.id} className={`f6 mv3 amendment-text`}>
          {amendment.text}
        </div>
        {amendment.revision && amendment.revision.passed === null && (
          <Link
            to={`/app/circle/${circle}/revisions/${amendment.revision.id}`}
            className={`f6 mv3 br-pill ba b--white bg-theme glow b--white pv1 ph2`}
          >
            Current Revision
          </Link>
        )}
      </div>
    </div>
  );
};

export default AmendmentView;
