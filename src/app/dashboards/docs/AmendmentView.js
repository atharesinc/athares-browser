import React from "react";
import FeatherIcon from "feather-icons-react";

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
                <div className="f5 bb b--white-30 pb2 amendment-title">
                    {amendment.title}
                </div>
                <div data-id={amendment.id} className={`f6 mv3 amendment-text`}>
                    {amendment.text}
                </div>
            </div>
        </div>
    );
};

export default AmendmentView;
