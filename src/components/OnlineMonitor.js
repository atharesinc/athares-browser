import { Component } from "reactn";

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
      this.setGlobal({ isOnline: navigator.onLine });
    }
  };
  render() {
    return null;
  }
}

export default OnlineMonitor;
