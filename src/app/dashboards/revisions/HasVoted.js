import React from "react";
import moment from "moment";

const HasVoted = ({ vote: { updatedAt, support } }) => {
    if (support) {
        return (
            <small className="f6 light-green db mb2 ml4">
                You voted to support this on{" "}
                {moment(updatedAt).format("M/DD/YYYY h:mm a")}
            </small>
        );
    } else {
        return (
            <small className="f6 light-red db mb2 ml4">
                You voted not to support this on{" "}
                {moment(updatedAt).format("M/DD/YYYY h:mm a")}
            </small>
        );
    }
};

export default HasVoted;
