import React, { Component } from "react";
import { GET_CIRCLE_NOTICES } from "../../../graphql/queries";
import CircleNotice from "./CircleNotice";
import { graphql } from "react-apollo";
import { FixedSizeList as List } from "react-window";

class NoticeBoard extends Component {
  row = ({ index }) => {
    const { notices } = this.props.data.Circle;
    return <CircleNotice key={notices[index].id} notice={notices[index]} />;
  };
  render() {
    const {
      loading,
      error,
      data: { Circle }
    } = this.props;
    if (error) {
      return (
        <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
          Unable to reach news server
        </div>
      );
    }
    if (loading) {
      return (
        <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
          Fetching News...
        </div>
      );
    }
    if (Circle) {
      return (
        <List
          height={300}
          itemCount={Circle.notices.length}
          itemSize={300}
          width={this.props.width}
        >
          {this.row}
        </List>
      );
    }
    return (
      <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
        No news available
      </div>
    );
  }
}

export default graphql(GET_CIRCLE_NOTICES, {
  options: ({ activeCircle }) => ({ variables: { id: activeCircle || "" } })
})(NoticeBoard);
