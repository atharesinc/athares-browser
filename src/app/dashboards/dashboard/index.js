import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import {
  updateCircle,
  updateChannel,
  updateRevision
} from "../../../store/state/actions";
import { Query, graphql } from "react-apollo";
import {
  GET_ALL_NOTICES,
  GET_CHANNELS_BY_CIRCLE_ID
} from "../../../graphql/queries";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  componentDidMount() {
    // fetch('https://github.com/repos/atharesinc/athares-browser/commits')
    //     .then(data => data.json)
    //     .then(data => {
    //         let news = data.map(
    //             ({
    //                 base_commit: {
    //                     commit: { message }
    //                 }
    //             }) => {
    //                 let newsItem = {
    //                     message: message.replace(/.+:\s(.*)/gi, '$1')
    //                 };
    //                 return newsItem;
    //             }
    //         );
    //         console.log(news);
    //     })
    //     .catch(err => {
    //         console.error("Couldn't connect to Github API");
    //     });
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
          <Query query={GET_ALL_NOTICES}>
            {({ loading, error, data }) => {
              if (error) {
                return <p>Error - Couldn't reach news server.</p>;
              }
              if (loading || data.allNotices.length === 0) {
                return (
                  <div className="bg-white-10 pv3 w-100 ph4 ttu tracked tc">
                    No News Available
                  </div>
                );
              } else {
                return data.allNotices.map(notice => (
                  <div className="bg-white-10 pv2 w-100 ph4" key={notice.id}>
                    <h3>{notice.title}</h3>
                    <p className="">{notice.text}</p>
                  </div>
                ));
              }
            }}
          </Query>
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
