import React, { Component } from "react";
import Circle from "./Circle";
import Loader from "../Loader";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import * as stateSelectors from "../../store/state/reducers";
import { updateCircle } from "../../store/state/actions";
import { withGun } from "../../utils/react-gun";
import { connect } from "react-redux";

class OtherCircles extends Component {
  state = {
    user: this.props.user,
    circles: []
  };

  async componentDidMount() {
    if (this.props.user) {
      let user = this.props.gun.user();
      let circleRef = this.props.gun.get("circles");

      let circles = [],
        refsToCircles = [];
      // get this user's circles
      let res = await user.get("circles").map(circle => {
        refsToCircles.push(circle);
        return circle;
      });

      // get each circle's data from the array of references
      let results = await refsToCircles.map(async c => {
        let res = await circleRef.get(c).once(data => {
          this.setState({
            circles: [...this.state.circles, data]
          });
        });
      });
    }
  }
  setActive = id => {
    this.props.dispatch(updateCircle(id));
  };
  render() {
    const { circles, user } = this.state;

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
            <Circle key={circle.id} {...circle} isActive={circle.id === this.props.activeCircle} selectCircle={this.setActive} />
          ))}
        </Scrollbars>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    activeCircle: stateSelectors.pull(state, "activeCircle"),
    pub: stateSelectors.pull(state, "pub")
  };
}

export default withGun(withRouter(connect(mapStateToProps)(OtherCircles)));
