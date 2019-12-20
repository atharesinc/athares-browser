import React, { withGlobal } from "reactn";
import { DELETE_WEB_SUB, CREATE_WEB_SUB } from "../graphql/mutations";
import { GET_WEB_SUBS } from "../graphql/queries";
import { graphql } from "react-apollo";
import compose from "lodash.flowright";
import swal from "sweetalert";

function ServiceWorkerMonitor(props) {
  useEffect(() => {
    componentMount();
  }, []);

  const componentMount = () => {
    if (getNotificationPermission() === "granted" && props.user) {
      doLogin();
    }
  };

  const getNotificationPermission = () => {
    return Notification.permission;
  };

  const doLogin = async () => {
    let activeSub = await getCurrentSub();
    let permission = getNotificationPermission();
    let subbed = currentlySubscribed(activeSub);
    if (permission === "granted" && subbed === false) {
      // user has allowed subs but isn't subscribed on this device
      createSub(subbed.subscription, props.user);
    }
  };

  const createSub = (sub, user) =>
    props.createWebSub({
      variables: {
        sub,
        user
      }
    });

  const doLogout = async () => {
    let activeSub = await getCurrentSub();
    let subbed = currentlySubscribed(activeSub);

    if (subbed) {
      deleteWebSub(activeSub.id);
    }
    props.sw.unregister();
  };
  const deleteWebSub = id => props.deleteWebSub({ variables: { id } });

  const currentlySubscribed = activeSub => {
    if (props.getWebSubs.User) {
      let { webSubs } = props.getWebSubs.User;
      let subNode = webSubs.find(
        s => s.subsciption.endpoint === activeSub.endpoint
      );
      return subNode ? subNode : false;
    }
    return false;
  };

  useEffect(() => {
    // user has logged in
    if (props.user !== null) {
      doLogin();
    }
    // user has logged out, delete the webPushSubscription in GQL, unregister the service worker
    if (props.user === null) {
      doLogout();
    }
  }, [props.user]);

  const getCurrentSub = () => {
    return new Promise(resolve => {
      navigator.serviceWorker.ready.then(async function(
        serviceWorkerRegistration
      ) {
        // Let's see if you have a subscription already
        resolve(await serviceWorkerRegistration.pushManager.getSubscription());
      });
    });
  };

  return null;
}

export default withGlobal(({ user }) => ({ user }))(
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
