import React from "react";
import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import { withGun } from "react-gun";

class ViewUser extends React.Component {
  state = {
    user: {
      firstName: "Ehrlich",
      lastName: "Bachman",
      email: "avia.to@mail.com",
      phone: "+1 555 123 4567",
      uname: "bachmanity",
      icon:
        "https://assets3.thrillist.com/v1/image/1734098/size/tmg-article_default_mobile.jpg",
      createdAt: new Date().toLocaleString()
    },
    voteCount: 0,
    revisionCount: 0,
    circleCount: 0,
    passedRevisionCount: 0
  };

  componentDidMount() {
    // get this user from this.props.match :id
    // let userRef = this.props.gun.get("users").get(this.props.match.params.id);
    // let newState = {
    //   user: null,
    //   voteCount: 0,
    //   revisionCount: 0,
    //   circleCount: 0,
    //   passedRevisionCount: 0
    // };
    // userRef.once(user => {
    //   newState.user = user;
    //   // now get their votes
    //   userRef.get("votes").once(votes => {
    //     newState.voteCount++;
    //   });
    //   // now get their revisions
    //   userRef.get("revisions").map(revision => {
    //     newState.revisionCount++;
    //     if (revision.passed) {
    //       newState.passedRevisionsCount++;
    //     }
    //   });
    //   // get their circles
    //   userRef.get("circles").once(circle => {
    //     newState.circleCount++;
    //   });
    // });
    // this.setState({
    //   ...newState
    // });
  }
  render() {
    const { user } = this.state;
    return (
      <div id="dashboard-wrapper">
        <div className="particles-bg w-100 vignette shaded">
          <header className="tc pv2 pv4-ns" style={{ height: "12em" }}>
            <div
              className="w-100 row-center"
              style={{ justifyContent: "space-between" }}
            />
            <h1 className="f4 f3-ns fw6 white">{`${user.firstName} ${
              user.lastName
            }`}</h1>
            <div
              className="br-100 pa1 br-pill ba bw2 w4 h4 center"
              style={{
                background: `url(${user.icon}) center no-repeat`,
                backgroundSize: "cover"
              }}
            />
          </header>
          <a
            target="__blank"
            href="https://www.flickr.com/photos/becca02/6727193557"
          >
            <FeatherIcon
              icon="info"
              className="h2 w2 white-30 hover-white ma1 pa1"
            />
          </a>
        </div>
        {/* user info */}
        <Scrollbars
          style={{ width: "100%", height: "100%" }}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          universal={true}
        >
          <ul className="list ph4 pv2 ma2 w-100 center">
            <h1>Info</h1>
            <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
              <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="phone" />
              <div className="pl3 flex-auto">
                <span className="f6 db white-70">Phone</span>
              </div>
              <div>
                <div className="f6 link white-70">{user.phone}</div>
              </div>
            </li>
            <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
              <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="at-sign" />
              <div className="pl3 flex-auto">
                <span className="f6 db white-70">Email</span>
              </div>
              <div>
                <div className="f6 link white-70">{user.email}</div>
              </div>
            </li>
            <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
              <FeatherIcon className="w2 h2 w2-ns h2-ns pa1" icon="link" />
              <div className="pl3 flex-auto">
                <span className="f6 db white-70">Unique Name</span>
              </div>
              <div>
                <div className="f6 link white-70">{user.uname}</div>
              </div>
            </li>
          </ul>
          {/* Fat Stats */}
          <article className="ph4 pv2" data-name="slab-stat">
            <h1>Statistics</h1>
            <dl className="dib mr5">
              <dd className="f6 f5-ns b ml0 white-70">Circles</dd>
              <dd className="f4 f3-ns b ml0">{this.state.circleCount}</dd>
            </dl>
            <dl className="dib mr5">
              <dd className="f6 f5-ns b ml0 white-70">Revisions Proposed</dd>
              <dd className="f4 f3-ns b ml0">{this.state.revisionCount}</dd>
            </dl>
            <dl className="dib mr5">
              <dd className="f6 f5-ns b ml0 white-70">Revisions Accepted</dd>
              <dd className="f4 f3-ns b ml0">
                {this.state.passedRevisionCount}
              </dd>
            </dl>
            <dl className="dib mr5">
              <dd className="f6 f5-ns b ml0 white-70">Times Voted</dd>
              <dd className="f4 f3-ns b ml0">{this.state.voteCount}</dd>
            </dl>
            <dl className="dib mr5">
              <dd className="f6 f5-ns b ml0 white-70">User Since</dd>
              <dd className="f4 f3-ns b ml0">{user.createdAt}</dd>
            </dl>
          </article>
        </Scrollbars>
      </div>
    );
  }
}

export default withGun(ViewUser);
