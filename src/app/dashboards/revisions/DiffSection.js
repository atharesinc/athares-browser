import React from "react";
import Diff from "react-stylable-diff-common";
// import Diff from "react-stylable-diff/dist/react-diff.js";
import { Scrollbars } from "react-custom-scrollbars";

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
        <Scrollbars style={{ height: "15rem", width: "100%" }}>
          <div className="pa3 flex flex-row h5">
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
        </Scrollbars>
      );
    default:
      return <div className="pa3 white pre-wrap lh-copy">{newText}</div>;
  }
};

export default DiffSection;
