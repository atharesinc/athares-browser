import React, { Component } from "react";
import ErrorSwap from "../../../utils/ErrorSwap";
import { withGun } from "../../../utils/react-gun";
import { connect } from "react-redux";
import * as stateSelectors from "../../../store/state/reducers";
import Loader from "../../Loader";
import { Scrollbars } from "react-custom-scrollbars";
import Gun from "gun/gun";

class CreateChannel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      isTaken: false,
      activeCircle: null,
      loading: true
    };
  }
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.push("/app");
    }
    // get circle details from activeCircle (really just the name but you never know)
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
    const name = e.target.value.substring(0, 51);
    this.setState({
      name,
      isTaken: false
    });
  };
  updateDesc = e => {
    this.setState({
      description: e.target.value.substring(0, 301)
    });
  };
  onSubmit = async e => {
    e.preventDefault();
    try {
      if (this.state.name.trim().length === 0) {
        return false;
      }

      // /* Check if doesn't exist */
      // if (this.props.checkIfNameUnique.Circle.channels.length !== 0) {
      //     return false;
      // }

      // validate & trim fields

      /* create channel */
      const newChannel = {
        name: this.state.name,
        circleId: this.props.activeCircle,
        description: this.state.description,
        channelType: "group",
        id: Gun.text.random()
      };

      this.props.gun
        .get("channels")
        .get(newChannel.id)
        .put(newChannel);

      this.props.history.push(
        `/app/circle/${this.props.activeCircle}/channel/${newChannel.id}`
      );
    } catch (err) {
      console.error(new Error(err));
    }
  };
  render() {
    const { loading, activeCircle } = this.state;
    // if (error) {
    //     return (
    //         <div
    //             id="dashboard-wrapper"
    //             style={{
    //                 justifyContent: "center"
    //             }}
    //             className="pa2"
    //         >
    //             <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">
    //                 Error connecting to network
    //             </h1>
    //         </div>
    //     );
    // }
    if (this.state.loading || loading) {
      return (
        <div
          id="dashboard-wrapper"
          style={{
            justifyContent: "center"
          }}
          className="pa2"
        >
          <Loader />
          {this.state.loading && (
            <h1 className="mb3 mt0 lh-title mt4 f3 f2-ns">Creating Channel</h1>
          )}
        </div>
      );
    }
    return (
      <div id="dashboard-wrapper">
        <form
          className="pa4 white wrapper"
          onSubmit={this.onSubmit}
          id="create-circle-form"
        >
          <Scrollbars style={{ height: "100%", width: "100%" }}>
            <article className="cf">
              <h1 className="mb3 mt0 lh-title">Create Channel</h1>
              <time className="f7 ttu tracked white-80">
                Create a new channel within {activeCircle.name}
              </time>
              <div className="fn mt4">
                <div className="measure mb4">
                  <label htmlFor="name" className="f6 b db mb2">
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
                    condition={
                      !this.state.isTaken ||
                      this.props.checkIfNameUnique.Circle.channels.length !== 0
                    }
                    normal={
                      <small id="name-desc" className="f6 white-80 db mb2">
                        This name must be unique to this Circle.
                      </small>
                    }
                    error={
                      <small id="name-desc" className="f6 red db mb2">
                        Sorry! This name has already been taken.
                      </small>
                    }
                  />
                </div>
                <div className="mv4">
                  <label htmlFor="comment" className="f6 b db mb2">
                    Description{" "}
                    <span className="normal white-80">(optional)</span>
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    className="db border-box w-100 measure ba pa2 mb2 ghost"
                    aria-describedby="comment-desc"
                    resize="false"
                    maxLength="300"
                    value={this.state.description}
                    onChange={this.updateDesc}
                  />
                  <small id="comment-desc" className="f6 white-80">
                    Describe this channel.
                  </small>
                </div>
              </div>
            </article>
            <div id="comment-desc" className="f6 white-80">
              By pressing "Create Channel" you will create a new government with
              a the above name and description. After this point, all changes
              must be made through the democratic revision process.
            </div>
            <button id="create-circle-button" className="btn mt4" type="submit">
              Create Channel
            </button>
          </Scrollbars>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: stateSelectors.pull(state, "user"),
    activeCircle: stateSelectors.pull(state, "activeCircle")
  };
}

export default withGun(connect(mapStateToProps)(CreateChannel));
