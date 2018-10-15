import React from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";

const BottomNav = ({ show, activeCircle }) => {
    // ask the user to log in
    if (!show) {
        return (
            <Link className="w-100" to={"/login"}>
                <div
                    className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3"
                    id="bottom-nav"
                >
                    <FeatherIcon
                        icon={"log-in"}
                        className="white w2 h2 mr3"
                        style={{ height: "1.5em", width: "1.5em" }}
                    />
                    <div className="white">Login or Register</div>
                </div>
            </Link>
        );
    }
    // user is logged in but no circle is selected
    if (show && !activeCircle) {
        return (
            <div
                className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3"
                                    id="bottom-nav"

            >
                <div className="white">Select a Circle</div>
            </div>
        );
    }
    // user is logged in and able to add a user to a defined circle
    return (
        <Link
            className="w-100"
            to={"/app/circle/" + activeCircle + "/add/user"}
        >
            <div
                className="w-100 v-mid bg-theme-dark flex flex-row justify-start items-center pv2 ph3"
                    id="bottom-nav"
            >
                <FeatherIcon
                    icon={"user-plus"}
                    className="white w2 h2 mr3"
                    style={{ height: "1.5em", width: "1.5em" }}
                />
                <div className="white">Invite User to Circle</div>
            </div>
        </Link>
    );
};
export default BottomNav;
