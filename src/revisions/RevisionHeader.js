import React from "reactn";

const RevisionHeader = ({ title, isRepeal, isNew }) => {
  return (
    <div className="ma3">
      <small className="f6 white-70 db mb2 ml3">
        {isNew
          ? "Review the proposed draft"
          : isRepeal
          ? "Decide if this amendment should be repealed and removed"
          : "Review changes to this amendment"}
      </small>
    </div>
  );
};

export default RevisionHeader;
