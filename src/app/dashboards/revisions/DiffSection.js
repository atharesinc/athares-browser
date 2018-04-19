import React from "react";
import Diff from "react-stylable-diff/dist";
// import Diff from "react-stylable-diff/dist/react-diff.js";

const DiffSection = ({ oldText, newText, mode }) => {
	switch (mode) {
		case 1:
			return (
				<Diff
					className="pa3 pre-wrap diff lh-copy"
					inputA={oldText}
					inputB={newText}
					type="words"
				/>
			);
		case 2:
			return (
				<div
					className="pa3 flex flex-row h5"
					style={{ overflowY: "scroll" }}
				>
					<div className="w-50 h-100 mr1">
						<Diff
							className="pre-wrap diff-hide white lh-copy br b--white-30 pr2"
							inputA={oldText}
							inputB={newText}
							type="words"
						/>
					</div>
					<div className="w-50 h-100 ml1">
						<Diff
							className="pre-wrap diff-show white lh-copy bl b--white-30 pl2"
							inputA={oldText}
							inputB={newText}
							type="words"
						/>
					</div>
				</div>
			);
		default:
			return <div className="pa3 white pre-wrap lh-copy">{newText}</div>;
	}
};

export default DiffSection;
