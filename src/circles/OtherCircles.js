import React, { Component } from "react";
import Circle from "./Circle";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { pull } from "../store/state/reducers";
import { updateCircle } from "../store/state/actions";
import { connect } from "react-redux";
import { GET_CIRCLES_BY_USER_ID } from "../graphql/queries";
import { Query } from "react-apollo";

class OtherCircles extends Component {
  setActive = id => {
    this.props.dispatch(updateCircle(id));
    this.props.history.push(`/app/circle/${id}`);
  };
  render() {
    let circles = [];
    return (
      <Query
        query={GET_CIRCLES_BY_USER_ID}
        variables={{ id: this.props.user || "" }}
        pollInterval={3000}
      >
        {({ loading, err, data = {} }) => {
          if (data.User) {
            circles = data.User.circles;
          }
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
        }}
      </Query>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeCircle: pull(state, "activeCircle"),
    pub: pull(state, "pub")
  };
}

export default withRouter(connect(mapStateToProps)(OtherCircles));
