import React from "react";
import FeatherIcon from "feather-icons-react";

const VoteButtons = ({ accept, reject }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
            }}
        >
            <div
                onClick={accept}
                className="bg-green light-green w-50 f3 tc dim pv2 vote-btn"
            >
                <FeatherIcon icon="check-circle" />
                ACCEPT
            </div>
            <div
                onClick={reject}
                className="bg-red light-pink w-50 f3 tc dim pv2 vote-btn"
            >
                <FeatherIcon icon="x-circle" />
                REJECT
            </div>
        </div>
    );
};

export default VoteButtons;
