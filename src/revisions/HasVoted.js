import React from "reactn";
import { parseDate } from "../utils/transform";

const HasVoted = ({ vote: { updatedAt, support } }) => {
  if (support) {
    return (
      <small className="f6 light-green db mb2 ml4-ns">
        You voted to support this on {parseDate(updatedAt, "P h:mm bbbb")}
      </small>
    );
  } else {
    return (
      <small className="f6 light-red db mb2 ml4-ns">
        You voted not to support this on {parseDate(updatedAt, "P h:mm bbbb")}
      </small>
    );
  }
};

export default HasVoted;
