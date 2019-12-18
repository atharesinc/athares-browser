import React from "react";
import EditSection from "./EditSection";

const AmendmentEdit = ({
  toggleEdit,
  save,
  cancel,
  repeal,
  update,
  text,
  amendment
}) => {
  return (
    <div
      className="editMask"
      onClick={e => {
        toggleEdit(e);
      }}
    >
      <div id={amendment.id} className="editable mb3 bg-theme">
        <div className="f4 pv2 amendment-title pl2">Edit Amendment</div>
        <div className="f6 pv2 amendment-title white-70 pl2">
          Here you can propose changes to this amendment, or you can issue a
          repeal, which will completely delete the amendment from the
          constitution.
        </div>
        <div className="f5 pv2 amendment-title white pl2">
          {amendment.title}
        </div>
        <div
          contentEditable={true}
          className={`f6 amendment-text editableText`}
          onInput={e => {
            update(e.target.innerText);
          }}
          suppressContentEditableWarning
        >
          {amendment.text}
        </div>
        <EditSection save={save} cancel={cancel} repeal={repeal} />
      </div>
    </div>
  );
};

export default AmendmentEdit;
