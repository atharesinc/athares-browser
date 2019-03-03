import { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../store/ui/reducers";
import { updateOnlineStatus } from "../store/ui/actions";

class OnlineMonitor extends Component {
  constructor() {
    super();
    this.timer = null;
  }
  componentDidMount() {
    this.timer = setInterval(this.checkOnline, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  checkOnline = e => {
    if (navigator.onLine !== this.props.isOnline) {
      this.props.dispatch(updateOnlineStatus(navigator.onLine));
    }
  };
  shouldComponentUpdate(nextProps) {
    return nextProps.isOnline !== this.props.isOnline;
  }
  render() {
    return null;
  }
}
function mapStateToProps(state) {
  return {
    isOnline: pull(state, "isOnline")
  };
}
export default connect(mapStateToProps)(OnlineMonitor);
