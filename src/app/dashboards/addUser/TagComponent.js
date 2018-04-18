import React from "react";

const TagComponent = props => {
	return (
		<button
			type="button"
			className={props.classNames.selectedTag}
			title="Click to remove tag"
			onClick={props.onDelete}
		>
			<img src={props.tag.icon} alt="" className="tag-icon" />{" "}
			<span className={props.classNames.selectedTagName}>
				{props.tag.name}
			</span>
		</button>
	);
};

export default TagComponent;
