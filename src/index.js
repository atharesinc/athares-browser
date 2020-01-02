import React, { setGlobal } from "reactn";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { link, cache } from "./graphql";
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  link,
  cache
});

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
  isOnline: false,
  showMenu: false
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);
serviceWorker.register();
