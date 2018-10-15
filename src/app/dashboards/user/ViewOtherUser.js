import React from "react";
import FeatherIcon from "feather-icons-react";
import { Scrollbars } from "react-custom-scrollbars";
import { withGun } from "react-gun";
import Loader from "../../Loader";
import moment from "moment";

class ViewUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            voteCount: 0,
            revisionCount: 0,
            circleCount: 0,
            passedRevisionCount: 0,
            loading: true
        };
        this._isMounted = false;
    }

    componentDidMount() {
        // get this user from this.props.match :id
        this._isMounted = true;
        this._isMounted && this.getUser();
    }
    getUser = () => {
        this.props.gun
            .get("users")
            .get(this.props.match.params.id)
            .once(pub => {
                let userRef = this.props.gun.user(pub);

                // make sure it's a real user
                let newState = {
                    user: null,
                    voteCount: 0,
                    revisionCount: 0,
                    circleCount: 0,
                    passedRevisionCount: 0
                };
                userRef.open(async user => {
                    newState.user = user.profile;
                    if (user.revisions) {
                        newState.revisionCount = Object.keys(
                            user.revisions
                        ).length;

                        // get all the revisions that got passed
                        let passedRevisions = Object.values(
                            user.revisions
                        ).filter(r => r.passed === true).length;
                        newState.passedRevisionCount = passedRevisions;
                    }
                    if (user.votes) {
                        newState.voteCount = Object.keys(user.votes).length;
                    }
                    if (user.circles) {
                        newState.circleCount = Object.keys(user.circles).length;
                    }
                    this._isMounted && (await this.setState({ ...newState }));
                    this.setState({
                        loading: false
                    });
                });
            });
    };
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        const { user, loading } = this.state;
        if (loading) {
            return (
                <div
                    id="dashboard-wrapper"
                    style={{
                        justifyContent: "center"
                    }}
                    className="pa2"
                >
                    <Loader />
                    <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">
                        Getting User Information
                    </h1>
                </div>
            );
        }
        return (
            <div id="dashboard-wrapper">
                <div className="particles-bg w-100 vignette shaded">
                    <header
                        className="tc pv2 pv4-ns"
                        style={{ height: "12em" }}
                    >
                        <div
                            className="w-100 row-center"
                            style={{ justifyContent: "space-between" }}
                        />
                        <h1 className="f4 f3-ns fw6 white">{`${
                            user.firstName
                        } ${user.lastName}`}</h1>
                        <div
                            className="br-100 pa1 br-pill ba bw2 w4 h4 center user-profile-icon"
                            style={{
                                backgroundSize: "contain !important",
                                background: `url(${user.icon}) center no-repeat`
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
                    <ul className="list ph2 ph4-ns pv2 ma2 w-100 center">
                        <h1>Info</h1>
                        <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
                            <FeatherIcon
                                className="w2 h2 w2-ns h2-ns pa1"
                                icon="phone"
                            />
                            <div className="pl3 flex-auto">
                                <span className="f6 db white-70">Phone</span>
                            </div>
                            <div>
                                <div className="f6 link white-70">
                                    {user.phone || "Not set"}
                                </div>
                            </div>
                        </li>
                        <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
                            <FeatherIcon
                                className="w2 h2 w2-ns h2-ns pa1"
                                icon="at-sign"
                            />
                            <div className="pl3 flex-auto">
                                <span className="f6 db white-70">Email</span>
                            </div>
                            <div>
                                <div className="f6 link white-70">
                                    {user.email || "Not set"}
                                </div>
                            </div>
                        </li>
                        <li className="flex items-center lh-copy pa3 ph0-l bb b--white-30">
                            <FeatherIcon
                                className="w2 h2 w2-ns h2-ns pa1"
                                icon="link"
                            />
                            <div className="pl3 flex-auto">
                                <span className="f6 db white-70">
                                    Unique Name
                                </span>
                            </div>
                            <div>
                                <div className="f6 link white-70">
                                    {user.uname || "Not set"}
                                </div>
                            </div>
                        </li>
                    </ul>
                    {/* Fat Stats */}
                    <article className="ph4 pv2" data-name="slab-stat">
                        <h1>Statistics</h1>
                        <dl className="dib mr5">
                            <dd className="f6 f5-ns b ml0 white-70">Circles</dd>
                            <dd className="f4 f3-ns b ml0">
                                {this.state.circleCount}
                            </dd>
                        </dl>
                        <dl className="dib mr5">
                            <dd className="f6 f5-ns b ml0 white-70">
                                Revisions Proposed
                            </dd>
                            <dd className="f4 f3-ns b ml0">
                                {this.state.revisionCount}
                            </dd>
                        </dl>
                        <dl className="dib mr5">
                            <dd className="f6 f5-ns b ml0 white-70">
                                Revisions Accepted
                            </dd>
                            <dd className="f4 f3-ns b ml0">
                                {this.state.passedRevisionCount}
                            </dd>
                        </dl>
                        <dl className="dib mr5">
                            <dd className="f6 f5-ns b ml0 white-70">
                                Times Voted
                            </dd>
                            <dd className="f4 f3-ns b ml0">
                                {this.state.voteCount}
                            </dd>
                        </dl>
                        <dl className="dib mr5">
                            <dd className="f6 f5-ns b ml0 white-70">
                                User Since
                            </dd>
                            <dd className="f4 f3-ns b ml0">
                                {" "}
                                {moment(user.createdAt).format("MM/DD/YY")}
                            </dd>
                        </dl>
                    </article>
                </Scrollbars>
            </div>
        );
    }
}

export default withGun(ViewUser);
