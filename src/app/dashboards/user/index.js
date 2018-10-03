import React, { Component } from "react";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import ViewOtherUser from "./ViewOtherUser"; // same as view user w/o btns to toggle
import { Switch, Route } from "react-router-dom";
import Loader from "../../Loader";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import * as stateSelectors from "../../../store/state/reducers";

class User extends Component {
    state = {
        loading: true,
        user: null,
        voteCount: 0,
        revisionCount: 0,
        circleCount: 0,
        passedRevisionCount: 0
    };
    componentDidMount() {
        if (!this.props.user) {
            this.props.history.push("/app");
        }
        // get the logged-in user ref
        let userRef = this.props.gun.user();
        let revisionsRef = this.props.gun.get("revisions");

        let newState = {
            user: null,
            voteCount: 0,
            revisionCount: 0,
            circleCount: 0,
            passedRevisionCount: 0
        };

        userRef.get("profile").once(user => {
            newState.user = { ...user };
            // now get their votes
            userRef.get("votes").forEach(vote => {
                newState.voteCount++;
            });
            // now get their revisions
            userRef.get("revisions").forEach(revision => {
                newState.revisionCount++;
                // We have to get the whole revision to see anything about it besides the id
                revisionsRef.get(revision).once(data => {
                    if (data.passed) {
                        newState.passedRevisionsCount++;
                    }
                });
            });
            // get their circles
            userRef.get("circles").forEach(circle => {
                newState.circleCount++;
            });
        });

        // For some reason I'm setting state with a function here ... ?
        this.setState(() => ({ ...newState, loading: false }));
    }
    render() {
        const { user, loading, ...stats } = this.state;
        const { match } = this.props;

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
            <Switch>
                <Route
                    exact
                    path={`${match.path}`}
                    component={props => (
                        <ViewUser {...props} stats={stats} user={user} />
                    )}
                />
                )
                <Route
                    exact
                    path={`${match.path}/edit`}
                    component={props => <EditUser {...props} user={user} />}
                />
                <Route
                    exact
                    path={`${match.path}/:id`}
                    component={props => <ViewOtherUser {...props} />}
                />
                {/* <Route
          component={props => {
            props.history.push(`/app`);
            return null;
          }}
        /> */}
            </Switch>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: stateSelectors.pull(state, "user"),
        pub: stateSelectors.pull(state, "pub")
    };
}

export default withGun(connect(mapStateToProps)(User));
