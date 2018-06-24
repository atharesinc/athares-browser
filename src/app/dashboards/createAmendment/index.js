import React, { Component } from "react";
import ErrorSwap from "../../../utils/ErrorSwap";
import { getActiveCircle, getUserLocal } from "../../../graphql/queries";
import { createRevision } from "../../../graphql/mutations";
import { compose, graphql } from "react-apollo";
import Loader from "../../Loader";
import { withRouter } from "react-router-dom";
import Scrollbars from "react-custom-scroll";

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
    onSubmit = async e => {
        e.preventDefault();
        console.log(this.state);
        // validate & trim fields
        await this.setState({ loading: true });
        try {
            const res = await this.props.createRevision({
                variables: {
                    circleID: this.props.getActiveCircle.activeCircle.id,
                    backerID: this.props.getUserLocal.user.id,
                    title: this.state.name,
                    newText: this.state.amendment
                }
            });
            const newID = res.data.createRevision.id;
            const { activeCircle: { id } } = this.props.getActiveCircle;
            await this.setState({ loading: false });

            this.props.history.push(`/app/circle/${id}/revisions/${newID}`);
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
        const { error, loading, activeCircle } = this.props.getActiveCircle;
        if (error) {
            return <div id="dashboard-wrapper">Error</div>;
        } else if (loading || this.state.loading) {
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
                                {activeCircle.name}.
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
                                                Draft your amendment. What do
                                                you want to add to your
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
                            revision for this amendment. Drafts must first be
                            ratified by a minimum electorate of Circle members,
                            and then must be approved with a majority of votes.
                            Amendment drafts are publicly accessible, but can be
                            removed by the owner at any point before
                            ratification.
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
            return <div id="dashboard-wrapper" />;
        }
    }
}
const WrappedCreateAmendment = withRouter(CreateAmendment);

export default compose(
    graphql(getUserLocal, { name: "getUserLocal" }),
    graphql(getActiveCircle, { name: "getActiveCircle" }),
    graphql(createRevision, { name: "createRevision" })
)(WrappedCreateAmendment);
