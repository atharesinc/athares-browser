import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import * as reducers from "./store/reducers";
import { loadingBarReducer } from "react-redux-loading-bar";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { link, cache } from "./graphql";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  link,
  cache
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ ...reducers, loadingBar: loadingBarReducer }),
  composeEnhancers(applyMiddleware(thunk))
);

setGlobal({
  // state
  user: null,
  activeCircle: null,
  activeChannel: null,
  activeRevision: null,
  activeAmendment: null,
  pub: null,
  circles: [],
  channels: [],
  unreadChannels: [],
  revisions: [],
  votes: [],
  users: [],
  amendments: [],
  messages: [],
  dms: [],
  unreadDMs: [],
  dmsgs: [],
  viewUser: null,
  // ui
  showSearch: false,
  dmSettings: false,
  showAddMoreUsers: false,
  searchParams: "",
  isOnline: false
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.register();
