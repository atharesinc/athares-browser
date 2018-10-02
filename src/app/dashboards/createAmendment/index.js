import React, { Component } from "react";
import ErrorSwap from "../../../utils/ErrorSwap";
import Loader from "../../Loader";
import { withRouter } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import * as stateSelectors from "../../../store/state/reducers";
import Gun from "gun/gun";
import moment from "moment";

class CreateAmendment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            amendment: "",
            isTaken: false,
            loading: false
        };
    }
    componentDidMount() {
        // verify this circle is real and that the user is logged in, but for now...
        if (!this.props.user || !this.props.activeCircle) {
            this.props.history.push("/app");
        }

        // get this circle and its amendments
        this.props.gun
            .get("circles")
            .get(this.props.activeCircle)
            .once(circle => {
                this.setState({
                    activeCircle: circle
                });
            });
    }
    updateName = e => {
        this.setState({
            name: e.target.value.substring(0, 51)
        });
    };
    updateAmend = e => {
        this.setState({
            amendment: e.target.innerText
        });
    };
    // the longest a revision must persist before votes are counted is 7 days ( many users), the shortest is about 30 seconds (1 user)
    // add this number of seconds to the createdAt time to determine when a revision should expire, where x is the number of users
    customSigm = x => {
        return 604800 / (1 + Math.pow(Math.E, -1 * (x - 10))) / 2;
    };
    onSubmit = async e => {
        e.preventDefault();
        console.log(this.state);
        // validate & trim fields
        await this.setState({ loading: true });
        try {
            const newRevision = {
                circle: this.props.getActiveCircle.activeCircle.id,
                backer: this.props.user,
                title: this.state.name,
                newText: this.state.amendment,
                id: Gun.text.random(),
                createdAt: moment().format(),
                updatedAt: moment().format(),
                expires: moment()
                    .add(
                        this.customSigm(this.state.activeCircle.users.length),
                        "s"
                    )
                    .format(),
                passed: false,
                // voterThreshold: Math.round(this.state.activeCircle.users.length / 2)
                voterThreshold: 1
            };

            this.props.gun
                .get("revisions")
                .get(newRevision.id)
                .put(newRevision);

            await this.setState({ loading: false });

            this.props.history.push(
                `/app/circle/${this.props.activeCircle}/revisions/${
                    newRevision.id
                }`
            );
        } catch (err) {
            console.error(new Error(err));
            this.setState({ loading: false });
        }
    };
    clearError = () => {
        this.setState({
            isTaken: false
        });
    };
    render() {
        const { activeCircle } = this.state;

        if (this.state.loading) {
            return (
                <div id="dashboard-wrapper" className="column-center">
                    <Loader />
                </div>
            );
        } else if (activeCircle) {
            return (
                <div id="dashboard-wrapper">
                    <form
                        className="pa4 white wrapper"
                        onSubmit={this.onSubmit}
                        id="create-circle-form"
                    >
                        <Scrollbars>
                            <article className="cf">
                                <h1 className="mb3 mt0 lh-title">
                                    Create Amendment
                                </h1>
                                <time className="f7 ttu tracked white-80">
                                    Draft a new piece of legislation for{" "}
                                    {activeCircle.name}
                                </time>
                                <div className="fn mt4">
                                    <div className="measure mb4">
                                        <label
                                            htmlFor="name"
                                            className="f6 b db mb2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            className="input-reset ba pa2 mb2 db w-100 ghost"
                                            type="text"
                                            aria-describedby="name-desc"
                                            required
                                            value={this.state.name}
                                            onChange={this.updateName}
                                        />
                                        <ErrorSwap
                                            condition={!this.state.isTaken}
                                            normal={
                                                <small
                                                    id="name-desc"
                                                    className="f6 white-80 db mb2"
                                                >
                                                    Provide a name for your new
                                                    amendment.
                                                </small>
                                            }
                                            error={
                                                <small
                                                    id="name-desc"
                                                    className="f6 red db mb2"
                                                >
                                                    Amendment must have a name
                                                </small>
                                            }
                                        />
                                    </div>
                                    <div className="mv4">
                                        <label
                                            htmlFor="comment"
                                            className="f6 b db mb2"
                                        >
                                            Amendment
                                        </label>
                                        <div
                                            contentEditable={true}
                                            className={`f6 amendment-text editableText ghost`}
                                            onInput={this.updateAmend}
                                            value={this.state.amendment}
                                            suppressContentEditableWarning
                                        />
                                        <ErrorSwap
                                            condition={!this.state.isTaken}
                                            normal={
                                                <small
                                                    id="comment-desc"
                                                    className="f6 white-80"
                                                >
                                                    Draft your amendment. What
                                                    do you want to add to your
                                                    government?
                                                </small>
                                            }
                                            error={
                                                <small
                                                    id="name-desc"
                                                    className="f6 red db mb2"
                                                >
                                                    You can't submit an empty
                                                    amendment.
                                                </small>
                                            }
                                        />
                                    </div>
                                </div>
                            </article>
                            <div id="comment-desc" className="f6 white-80">
                                Pressing "Draft Amendment" will create a new
                                revision for this amendment. Drafts must first
                                be ratified by a minimum electorate of Circle
                                members, and then must be approved with a
                                majority of votes. Amendment drafts are publicly
                                accessible, but can be removed by the owner at
                                any point before ratification.
                            </div>
                            <button
                                id="create-circle-button"
                                className="btn mt4"
                                type="submit"
                            >
                                Draft Amendment
                            </button>
                        </Scrollbars>
                    </form>
                </div>
            );
        } else {
            return (
                <div
                    id="dashboard-wrapper"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Loader />
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        user: stateSelectors.pull(state, "user"),
        activeCircle: stateSelectors.pull(state, "activeCircle")
    };
}
export default withRouter(withGun(connect(mapStateToProps)(CreateAmendment)));
