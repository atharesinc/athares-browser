import { useState } from 'react';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { DELETE_WEB_SUB, CREATE_WEB_SUB } from '../graphql/mutations';
import { GET_WEB_SUBS } from '../graphql/queries';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import swal from 'sweetalert';

function ServiceWorkerMonitor (){
useEffect(()=>{
 componentMount();
}, [])

const componentMount =    => {
    if (this.getNotificationPermission() === 'granted' && props.user) {
      this.doLogin();
    }
  }
  const getNotificationPermission = () => {
    return Notification.permission;
  };
  const doLogin = async () => {
    let activeSub = await this.getCurrentSub();
    let permission = this.getNotificationPermission();
    let subbed = this.currentlySubscribed(activeSub);
    if (permission === 'granted' && subbed === false) {
      // user has allowed subs but isn't subscribed on this device
      this.createSub(subbed.subscription, props.user);
    }
  };
  createSub = (sub, user) =>
    props.createWebSub({
      variables: {
        sub,
        user,
      },
    });

  doLogout = async () => {
    let activeSub = await this.getCurrentSub();
    let subbed = this.currentlySubscribed(activeSub);

    if (subbed) {
      this.deleteWebSub(activeSub.id);
    }
    props.sw.unregister();
  };
  const deleteWebSub = id => props.deleteWebSub({ variables: { id } });

  currentlySubscribed = activeSub => {
    if (props.getWebSubs.User) {
      let { webSubs } = props.getWebSubs.User;
      let subNode = webSubs.find(
        s => s.subsciption.endpoint === activeSub.endpoint,
      );
      return subNode ? subNode : false;
    }
    return false;
  };
  async componentDidUpdate(prevProps) {
    // user has logged in
    if (prevProps.user === null && props.user !== null) {
      this.doLogin();
    }
    // user has logged out, delete the webPushSubscription in GQL, unregister the service worker
    if (prevProps.user !== null && props.user === null) {
      this.doLogout();
    }
  }
  const getCurrentSub = () => {
    return new Promise(resolve => {
      navigator.serviceWorker.ready.then(async function(
        serviceWorkerRegistration,
      ) {
        // Let's see if you have a subscription already
        resolve(await serviceWorkerRegistration.pushManager.getSubscription());
      });
    });
  };
  
    return null;
  }
}
function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(DELETE_WEB_SUB, {
      name: 'deleteWebSub',
    }),
    graphql(CREATE_WEB_SUB, { name: 'createWebSub' }),
    graphql(GET_WEB_SUBS, {
      name: 'getWebSubs',
      options: ({ user }) => ({ variables: { id: user || '' } }),
    }),
  )(ServiceWorkerMonitor),
);
