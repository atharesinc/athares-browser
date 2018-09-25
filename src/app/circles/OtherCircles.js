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

  componentDidMount() {
    if (this.props.user) {
      // get this user's circles
      console.log(this.props);
      let user = this.props.gun.user(this.props.pub);
      let circleRef = this.props.gun.get("circles");

      let circles = [];

      user
        .get("profile")
        .get("circles")
        .map(circle => {
          circleRef.get(circle).once(data => {
            circles.push(data);
          });
        });

      this.setState({
        circles
      });
    }
  }
  setActive = id => {
    this.props.dispatch(updateCircle(id));
    this.props.history.push("/app/circle/" + id);
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
    user: stateSelectors.pull(state, "user"),
    activeCircle: stateSelectors.pull(state, "activeCircle"),
    pub: stateSelectors.pull(state, "pub")
  };
}

export default withGun(withRouter(connect(mapStateToProps)(OtherCircles)));
