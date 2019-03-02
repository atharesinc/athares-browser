// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit http://bit.ly/CRA-PWA"
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(reg => {
      var serviceWorker;
      if (reg.installing) {
        serviceWorker = reg.installing;
        // console.log('Service worker installing');
      } else if (reg.waiting) {
        serviceWorker = reg.waiting;
        // console.log('Service worker installed & waiting');
      } else if (reg.active) {
        serviceWorker = reg.active;
        // console.log('Service worker active');
      }

      if (serviceWorker) {
        // console.log("sw current state", serviceWorker.state);
        if (serviceWorker.state === "activated") {
          //If push subscription wasnt done yet have to do here
          // console.log("sw already activated - Do watever needed here");
        }
        // serviceWorker.addEventListener("statechange", e => {
        //   stateChange(e, reg);
        // });
        serviceWorker.addEventListener("fetch", fetchHandler);
        // // serviceWorker.addEventListener("push", e => {
        //   pushHandler(e, reg);
        // });
      }
    })
    .catch(error => {
      console.error("Error during service worker registration:", error);
    });
}

// function stateChange(e, reg) {
//   // console.log("sw statechange : ", e.target.state);
//   if (e.target.state === "activated") {
//     // use pushManger for subscribing here.
//     success(reg);
//   }
// }
// function pushHandler(event, reg) {
//   if (event.data) {
//     console.log("Push event!! ", event.data);
//     showLocalNotification("New Message", event.data.text(), reg);
//   } else {
//     console.log("Push event but no data");
//   }
// }
// const showLocalNotification = (title, body, reg) => {
//   const options = {
//     body
//     // here you can add more properties like icon, image, vibrate, etc.
//   };
//   reg.showNotification(title, options);
// };

function fetchHandler(event) {
  // console.log("Request -->", event.request.url);
  // //To tell browser to evaluate the result of event
  // event.respondWith(
  //   caches
  //     .match(event.request) //To match current request with cached request it
  //     .then(function(response) {
  //       //If response found return it, else fetch again.
  //       return response || fetch(event.request);
  //     })
  //     .catch(function(error) {
  //       console.error("Error: ", error);
  //     })
  // );
}
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    return new Promise(resolve => {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
        resolve(true);
      });
    });
  }
  return false;
}

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

async function success(registration) {
  //// register our push thing?
  // try {
  //   const applicationServerKey = urlB64ToUint8Array(
  //     "BK7vkqUTCCJa_crRPyl8VfMzgEFKHgEChiPrHdMqNbvsfamOGREF5iZD5lLk7zSI_aGLLrjeXN41ZcLxnGUE7y8"
  //   );
  //   const options = { applicationServerKey, userVisibleOnly: true };
  //   const subscription = await registration.pushManager.subscribe(options);
  //   console.log(JSON.stringify(subscription));
  // } catch (err) {
  //   console.log("Error", new Error(err));
  // }
}
