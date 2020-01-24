import React, { setGlobal } from 'reactn';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { AppProvider } from '@8base/react-sdk';

import { link, cache } from './graphql';
import {
  authClient,
  onSuccess,
  onError,
  workspaceEndpoint,
} from './graphql/auth';
import App from './App';
import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  link,
  cache,
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
  searchParams: '',
  isOnline: false,
  showMenu: false,
  darkMode: false,
});

render(
  <AppProvider
    uri={workspaceEndpoint}
    authClient={authClient}
    onRequestSuccess={onSuccess}
    onRequestError={onError}
    withSubscriptions={true}
  >
    {/* <ApolloProvider client={client}> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </ApolloProvider> */}
  </AppProvider>,
  document.getElementById('root'),
);
serviceWorker.register();
