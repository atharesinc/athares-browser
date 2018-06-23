import React, { Component } from "react";
import Circle from "./Circle";
import Loader from "../Loader";
import { graphql, compose } from "react-apollo";
import { getUserCircles, getActiveCircle } from "../../graphql/queries";
import { setActiveCircle } from "../../graphql/mutations";
import { withRouter } from "react-router-dom";

class OtherCircles extends Component {
    setActive = id => {
        this.props.setActiveCircle({ variables: { id } });
        this.props.history.push("/app/circle/" + id);
    };
    render() {
        const { loading, allCircles, error } = this.props.getUserCircles;
        if (loading) {
            return (
                <div id="other-circles">
                    <Loader />
                </div>
            );
        } else if (error) {
            return (
                <div id="other-circles">
                    <div>Error</div>
                </div>
            );
        } else if (allCircles.length !== 0) {
            return (
                <div id="other-circles">
                    {allCircles.map(circle => (
                        <Circle
                            key={circle.id}
                            {...circle}
                            isActive={
                                circle.id ===
                                this.props.getActiveCircle.activeCircle.id
                            }
                            selectCircle={this.setActive}
                        />
                    ))}
                </div>
            );
        } else {
            return <div id="other-circles" />;
        }
    }
}

const OtherCirclesWithRouter = withRouter(OtherCircles);

export default compose(
    graphql(setActiveCircle, { name: "setActiveCircle" }),
    graphql(getActiveCircle, { name: "getActiveCircle" }),
    graphql(getUserCircles, {
        name: "getUserCircles",
        options: ({ userId }) => ({
            variables: {
                id: userId
            }
        })
    })
)(OtherCirclesWithRouter);
