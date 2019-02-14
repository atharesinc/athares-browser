import React, { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../../../store/state/reducers";
import { updateCircle } from "../../../store/state/actions";
import Loader from "../../../components/Loader";
import swal from "sweetalert";
import FeatherIcon from "feather-icons-react";
import { Link } from "react-router-dom";
import { DELETE_USER_FROM_CIRCLE } from "../../../graphql/mutations";
import { GET_CIRCLE_NAME_BY_ID } from "../../../graphql/queries";
import { graphql, Query } from "react-apollo";
import LeaveCircle from "./leaveCircle";
import ShareCircle from "./shareCircle";
import ScrollBars from "react-custom-scrollbars";

class Settings extends Component {
  componentDidMount() {
    // verify this circle is real and that the user is logged in, but for now...
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }
  componentDidUpdate() {
    if (!this.props.user || !this.props.activeCircle) {
      this.props.history.replace("/app");
    }
  }
  leaveCircle = e => {
    e.preventDefault();
    let { activeCircle, user } = this.props;

    swal("Are you sure you'd like to leave this Circle?", {
      buttons: {
        cancel: "Not yet",
        confirm: true
      }
    }).then(async value => {
      if (value === true) {
        this.props.deleteUserFomCircle({
          variables: {
            user,
            circle: activeCircle
          }
        });
        swal(
          "Removed From Circle",
          `You have left this Circle. You will have to be re-invited to participate at a later time.`,
          "warning"
        );
        this.props.dispatch(updateCircle(null));
        this.props.history.push(`/app`);
      }
    });
  };
  back = () => {
    this.props.history.push(`/app`);
  };
  render() {
    return (
      <div id="revisions-wrapper">
        <div className="flex ph2 mobile-nav">
          <Link to="/app" className="flex justify-center items-center">
            <FeatherIcon
              icon="chevron-left"
              className="white db dn-l"
              onClick={this.back}
            />
          </Link>
          <h2 className="ma3 lh-title white"> Settings </h2>
        </div>
        <div
          id="create-circle-form"
          className="pa2 pa4-ns white wrapper mobile-body"
        >
          <ScrollBars
            style={{ width: "100%", height: "100%" }}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            universal={true}
          >
            <ShareCircle />
            <LeaveCircle />
          </ScrollBars>
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

export default connect(mapStateToProps)(Settings);
