import React, { Component } from "react";
import Amendment from "./Amendment";
import DocsSearchBar from "./DocsSearchBar";
import Loader from "../../Loader.js";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";
import { withGun } from "react-gun";
import * as stateSelectors from "../../../store/state/reducers";

class Constitution extends Component {
  state = {
    circle: null,
    amendments: []
  };

  componentDidMount() {
    // get this circle's id from activeCircle if possible or whatever is in the url bar
    let circleID = this.props.activeCircle
      ? this.props.activeCircle
      : this.props.match.params.id;

    let circleRef = this.props.gun.get("circles").get(circleID);
    let amendmentsRef = this.props.gun.get("amendments");

    // Get the circle's info and its amendments from Gun
    circleRef.once(circle => {
      let amendments = [];
      circleRef.get("amendments").map(amendmentID => {
        amendmentsRef.get(amendmentID).once(amendment => {
          amendments.push(amendment);
        });
      });

      // Update state
      this.setState({
        circle,
        amendments
      });
    });
  }
  render() {
    const { amendments, circle } = this.state;

    // if (loading) {
    //   return (
    //     <div id="docs-wrapper" className="column-center">
    //       <Loader />
    //       <div className="f3 pb2 b mv4 tc">Loading Constitution</div>
    //     </div>
    //   );
    // }
    if (circle) {
      return (
        <div id="docs-wrapper">
          {this.props.user && <DocsSearchBar id={circle.id} />}
          <div id="docs-inner" className="pa2 pa4-ns">
            <div className="f2 pb2 b bb b--white-30 mv4 tc">
              The Bill of Rights & All Amendments
            </div>
            <div className="f3 b mv4">Preamble</div>
            <div className="f6 mt3 mb4">{circle.preamble}</div>
            <Scrollbars style={{ width: "100%", height: "70vh" }}>
              {amendments.map((section, i) => (
                <Amendment
                  key={i}
                  editable={this.props.user !== null}
                  updateItem={this.updateItem}
                  amendment={section}
                  addSub={this.addSub}
                />
              ))}
            </Scrollbars>
          </div>
        </div>
      );
    } else {
      return (
        <div
          id="docs-wrapper"
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Loader />
          <div className="f3 pb2 b mv4 tc">Loading Constitution</div>
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

export default withGun(connect(mapStateToProps)(Constitution));
