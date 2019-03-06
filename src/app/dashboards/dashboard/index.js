import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import {
  updateCircle,
  updateChannel,
  updateRevision
} from "../../../store/state/actions";
import { Query, graphql, compose } from "react-apollo";
import {
  GET_CIRCLE_NOTICES,
  GET_CHANNELS_BY_CIRCLE_ID
} from "../../../graphql/queries";
import Scrollbars from "react-custom-scrollbars";
import CircleNotice from "./CircleNotice";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  componentDidMount() {
    let circleId = this.props.location.pathname.match(
      /\/circle\/([a-zA-Z0-9]{25})/
    );
    if (circleId !== null) {
      circleId = circleId[1];
      this.setState({
        circle: circleId
      });
      this.props.dispatch(updateCircle(circleId));
    }
    this.props.dispatch(updateChannel(null));
    this.props.dispatch(updateRevision(null));
  }
  componentDidUpdate(prevProps, prevState) {
    let circleId = this.props.location.pathname.match(
      /\/circle\/([a-zA-Z0-9]{25})/
    );

    if (circleId !== null) {
      circleId = circleId[1];

      if (this.props.activeCircle !== circleId) {
        this.props.dispatch(updateCircle(circleId));
      }
    }
  }
  render() {
    return (
      <div
        id="dashboard-wrapper"
        className="horizontal pa3"
        style={{
          display: "block"
        }}
      >
        <div
          className="contain bg-center h4 pa2 mb2"
          style={{
            backgroundImage: "url(/img/Athares-type-large-white.png)",
            height: "3rem",
            margin: "2em auto"
          }}
        />
        <div className="f7 ttu tracked white-80 mb3">
          Distributed Democracy Platform
        </div>
        <div className="mw9 center">
          {this.props.user ? (
            <div className="cf mb3">
              <Link className="fl w-100 pv2" to={"/app/new/circle"}>
                <div className="bg-white-10 tc dashboard-item">
                  <div className="dashboard-title white">Create New Circle</div>
                </div>
              </Link>
              {/*<Link className="fl w-100 w-50-ns pv2" to={"/app/new/message"}>
                                <div className="bg-white-20 tc dashboard-item">
                                  <div className="dashboard-title white">Message User</div>
                                </div>
                            </Link> */}
            </div>
          ) : (
            <Link className="pv3 w-100 ph4" to={"/login"}>
              <div className="bg-white-10 pv3 w-100 ph4 tracked tc transparent-hover-white">
                You are not signed in
              </div>
            </Link>
          )}
          <div className="bg-white-20 mt2 pv3 w-100 ph4 ttu tracked">
            Athares News
          </div>
          <Scrollbars style={{ width: "100%", height: "50vh" }}>
            <Query
              query={GET_CIRCLE_NOTICES}
              variables={{ id: this.props.activeCircle || "" }}
            >
              {({ loading, error, data: { Circle } }) => {
                let notices = null;
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
                  return Circle.notices.map(notice => (
                    <CircleNotice key={notice.id} notice={notice} />
                  ));
                }
                return (
                  <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
                    No news available
                  </div>
                );
              }}
            </Query>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: pull(state, "user"),
    activeCircle: pull(state, "activeCircle")
  };
}

export default connect(mapStateToProps)(
  graphql(GET_CHANNELS_BY_CIRCLE_ID, {
    name: "getCircle",
    options: ({ activeCircle }) => ({ variables: { id: activeCircle || "" } })
  })(Dashboard)
);
