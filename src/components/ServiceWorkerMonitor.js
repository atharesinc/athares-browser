import { Component } from "react";
import { connect } from "react-redux";
import { pull } from "../store/state/reducers";
import { DELETE_WEB_SUB, CREATE_WEB_SUB } from "../graphql/mutations";
import { GET_WEB_SUBS } from "../graphql/queries";
import { compose, graphql } from "react-apollo";
import swal from "sweetalert";

class ServiceWorkerMonitor extends Component {
  componentDidMount() {
    if (this.getNotificationPermission() === "granted" && this.props.user) {
      this.doLogin();
    }
  }
  getNotificationPermission = () => {
    return Notification.permission;
  };
  doLogin = async () => {
    let activeSub = await this.getCurrentSub();
    let permission = this.getNotificationPermission();
    let subbed = this.currentlySubscribed(activeSub);
    if (permission === "granted" && subbed === false) {
      // user has allowed subs but isn't subscribed on this device
      this.createSub(subbed.subscription, this.props.user);
    }
  };
  createSub = (sub, user) =>
    this.props.createWebSub({
      variables: {
        sub,
        user
      }
    });

  doLogout = async () => {
    let activeSub = await this.getCurrentSub();
    let subbed = this.currentlySubscribed(activeSub);

    if (subbed) {
      this.deleteWebSub(activeSub.id);
    }
    this.props.sw.unregister();
  };
  deleteWebSub = id => this.props.deleteWebSub({ variables: { id } });

  currentlySubscribed = activeSub => {
    if (this.props.getWebSubs.User) {
      let { webSubs } = this.props.getWebSubs.User;
      let subNode = webSubs.find(
        s => s.subsciption.endpoint === activeSub.endpoint
      );
      return subNode ? subNode : false;
    }
    return false;
  };
  async componentDidUpdate(prevProps) {
    // user has logged in
    if (prevProps.user === null && this.props.user !== null) {
      this.doLogin();
    }
    // user has logged out, delete the webPushSubscription in GQL, unregister the service worker
    if (prevProps.user !== null && this.props.user === null) {
      this.doLogout();
    }
  }
  getCurrentSub = () => {
    return new Promise(resolve => {
      navigator.serviceWorker.ready.then(async function(
        serviceWorkerRegistration
      ) {
        // Let's see if you have a subscription already
        resolve(await serviceWorkerRegistration.pushManager.getSubscription());
      });
    });
  };
  render() {
    return null;
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, "user")
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(DELETE_WEB_SUB, {
      name: "deleteWebSub"
    }),
    graphql(CREATE_WEB_SUB, { name: "createWebSub" }),
    graphql(GET_WEB_SUBS, {
      name: "getWebSubs",
      options: ({ user }) => ({ variables: { id: user || "" } })
    })
  )(ServiceWorkerMonitor)
);
