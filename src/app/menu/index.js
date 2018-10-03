import React from "react";
import { pushRotate as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { logout } from "../../store/state/actions";
import { connect } from "react-redux";

const MenuWrapper = ({ isOpen, history, isMenuOpen, user, ...props }) => {
    const logoutUser = async () => {
        props.dispatch(logout());
        sessionStorage.clear();

        history.push("/login");
    };

    return (
        <Menu
            pageWrapId={"app-wrapper"}
            outerContainerId={"app-wrapper-outer"}
            isOpen={isOpen}
            customBurgerIcon={false}
            customCrossIcon={false}
            menuClassName={"push-menu white pt2"}
            onStateChange={isMenuOpen}
        >
            {user ? (
                <Link
                    className="dt w-100 pb2-ns pv2 pl2-ns pl3 dim hover-bg-black-05"
                    to="/app/user"
                >
                    <div className="dtc w3 h3 v-mid">
                        <img
                            src={user.icon}
                            className="ba b--white db br-100 w3 h3 bw1"
                            alt="Menu"
                        />
                    </div>
                    <div className="dtc v-mid pl3">
                        <h1 className="f5 f5-ns fw6 lh-title white mv0">
                            {user.firstName + " " + user.lastName}
                        </h1>
                        <h2 className="f6 f7-ns fw4 mt0 mb0 white-60">
                            View Profile
                        </h2>
                    </div>
                </Link>
            ) : (
                <Link
                    className="dt w-100 pb2-ns pv2 pl2-ns pl3 dim hover-bg-black-05"
                    to="/login"
                >
                    <div className="dtc w3 h3 v-mid">
                        <img
                            src={
                                window.location.origin + "/img/user-default.png"
                            }
                            className="ba b--white db br-100 w3 h3 bw1"
                            alt="Menu"
                        />
                    </div>
                    <div className="dtc v-mid pl3">
                        <h1 className="f5 f5-ns fw6 lh-title white mv0">
                            Anonymous
                        </h1>
                        <h2 className="f6 f7-ns fw4 mt0 mb0 white-60">
                            Click to log in
                        </h2>
                    </div>
                </Link>
            )}
            {/* Sub menu */}

            <div className="channel-group-label"> Settings </div>

            <ul className="list pl0 mt0 measure center">
                <Link
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                    to="/about"
                >
                    <FeatherIcon
                        className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                        icon="help-circle"
                    />
                    <div className="pl3 flex-auto" to="about">
                        <span className="f5 db white">About</span>
                        <span className="f7 db white-70">FAQs & Us</span>
                    </div>
                </Link>
                <Link
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                    to="policy"
                >
                    <FeatherIcon
                        className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                        icon="info"
                    />
                    <div className="pl3 flex-auto">
                        <span className="f5 db white">Privacy</span>
                        <span className="f7 db white-70">
                            Privacy Policy & Terms of Service
                        </span>
                    </div>
                </Link>
                <Link
                    className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                    to="/contact"
                >
                    <FeatherIcon
                        className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                        icon="at-sign"
                    />
                    <div className="pl3 flex-auto">
                        <span className="f5 db white">Contact Us</span>
                        <span className="f7 db white-70">Report an issue</span>
                    </div>
                </Link>
                {user && (
                    <div
                        className="flex items-center lh-copy ph3 h3 bb b--white-10 dim"
                        onClick={logoutUser}
                    >
                        <FeatherIcon
                            className="w2 h2 w3-ns h3-ns pa3-ns pa0"
                            icon="log-out"
                        />
                        <div className="pl3 flex-auto">
                            <span className="f5 db white">Log Out</span>
                        </div>
                    </div>
                )}
            </ul>
        </Menu>
    );
};

function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(MenuWrapper);
