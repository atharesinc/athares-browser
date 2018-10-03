import React from "react";

import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import Circle from "./Circle";
import { Link } from "react-router-dom";
import { updateCircle } from "../../store/state/actions";
import { connect } from "react-redux";

const Circles = ({ circles = [], ...props }) => {
    const setActive = id => {
        this.props.dispatch(updateCircle(id));
    };
    return (
        <div
            className="w-100 v-mid bg-theme-dark flex flex-row justify-between items-center pv2 ph3"
            style={{ height: "3em" }}
        >
            <Link to="app/new/circle">
                <FeatherIcon
                    icon="plus-circle"
                    className="white w2 h2 mr2"
                    style={{ height: "1.5em", width: "1.5em" }}
                />
            </Link>
            <Scrollbars
                style={{ width: "80vw", height: "100%" }}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                universal={true}
            >
                <div className="flex flex-row justify-left items-center">
                    {circles.map(circle => (
                        <Circle
                            key={circle.id}
                            {...circle}
                            isActive={circle.id === props.activeCircle}
                            selectCircle={setActive}
                        />
                    ))}
                </div>
            </Scrollbars>
        </div>
    );
};

function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Circles);
