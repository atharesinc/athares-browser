import React, { setGlobal } from 'reactn';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@8base/react-sdk';

import {
  authClient,
  onSuccess,
  onError,
  workspaceEndpoint,
} from './graphql/auth';
import App from './App';
import * as serviceWorker from './serviceWorker';

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
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>,
  document.getElementById('root'),
);
serviceWorker.register();
