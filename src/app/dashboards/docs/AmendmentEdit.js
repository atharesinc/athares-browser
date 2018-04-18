import React from "react";
import EditSection from "./EditSection";

const AmendmentEdit = ({
	toggleEdit,
	save,
	cancel,
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
			<div id={amendment.id} className="editable mb3">
				<div className="f5 bb b--white-30 pv2 amendment-title black pl2">
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
				<EditSection save={save} cancel={cancel} />
			</div>
		</div>
	);
};

export default AmendmentEdit;
