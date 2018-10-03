import React, { Component } from "react";
import Circle from "./Circle";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { pull } from "../../store/state/reducers";
import { updateCircle } from "../../store/state/actions";
import { withGun } from "react-gun";
import { connect } from "react-redux";

class OtherCircles extends Component {
    state = {
        user: this.props.user
        // circles: []
    };

    async componentDidMount() {
        // if (this.props.user) {
        //   let user = this.props.gun.user();
        //   let circleRef = this.props.gun.get("circles");
        //   let circles = [],
        //     refsToCircles = [];
        //   // get this user's circles
        //   let res = await user.get("circles").map(circle => {
        //     refsToCircles.push(circle);
        //     return circle;
        //   });
        //   // get each circle's data from the array of references
        //   let results = await refsToCircles.map(async c => {
        //     let res = await circleRef.get(c).once(data => {
        //       this.setState({
        //         circles: [...this.state.circles, data]
        //       });
        //     });
        //   });
        // }
        // console.log(this.props.circles);
        // this.setState({
        //     circles: this.props.circles
        // });
    }
    // componentDidUpdate(prevProps){
    //   // deep equals?
    //   if (prevProps.circle){

    //   }
    // }
    setActive = id => {
        this.props.dispatch(updateCircle(id));
    };
    render() {
        const { circles } = this.props;

        return (
            <div id="other-circles">
                <Scrollbars
                    style={{ width: "100%", height: "100%" }}
                    className="splash"
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    universal={true}
                >
                    {circles.map(circle => (
                        <Circle
                            key={circle.id}
                            {...circle}
                            isActive={circle.id === this.props.activeCircle}
                            selectCircle={this.setActive}
                        />
                    ))}
                </Scrollbars>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: pull(state, "user"),
        activeCircle: pull(state, "activeCircle"),
        pub: pull(state, "pub"),
        circles: pull(state, "circles")
    };
}

export default withGun(withRouter(connect(mapStateToProps)(OtherCircles)));
