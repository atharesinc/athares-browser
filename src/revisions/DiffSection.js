import React from "react";
import Diff from "react-stylable-diff-common";
import { Scrollbars } from "react-custom-scrollbars";

const DiffSection = ({ oldText, newText, mode }) => {
  switch (mode) {
    case 1:
      return (
        <Scrollbars style={{ maxHeight: "11.5rem", width: "100%" }} autoHeight>
          <Diff
            className="pa3 pre-wrap diff lh-copy"
            inputA={oldText}
            inputB={newText}
            type="words"
          />
        </Scrollbars>
      );
    case 2:
      return (
        <Scrollbars style={{ maxHeight: "11.5rem", width: "100%" }} autoHeight>
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
      return (
        <Scrollbars style={{ maxHeight: "11.5rem", width: "100%" }} autoHeight>
          <div className="pa3 white pre-wrap lh-copy">{newText}</div>
        </Scrollbars>
      );
  }
};

export default DiffSection;