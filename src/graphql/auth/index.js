import { Auth, AUTH_STRATEGIES } from '@8base/auth';

const domain = process.env.REACT_APP_AUTH_DOMAIN;
const clientId = process.env.REACT_APP_AUTH_CLIENT_ID;
/**
 * The redirect and logout URIs are all configured in the
 * authentication profile that gets set up in the 8base
 * management console.
 */
const logoutRedirectUri = `${window.location.origin}/app`;
const redirectUri = `${window.location.origin}/auth/success`;
/**
 * There are multiple auth strategies that can be
 * used when using 8base. By default, specifying
 * 'web_8base' will configure the 8base auth client.
 */
const authClient = Auth.createClient(
  {
    strategy: AUTH_STRATEGIES.WEB_8BASE,
    subscribable: true,
  },
  {
    domain,
    clientId,
    redirectUri,
    logoutRedirectUri,
  },
);

const workspaceEndpoint = process.env.REACT_APP_WORKSPACE_ENDPOINT;

const onSuccess = ({ operation }) => {
  // const message = operation.getContext();
  // if (message) {
  //   // eslint-disable-next-line no-console
  //   console.error('no issues here!', message);
  // }
};

const onError = ({ graphQLErrors }) => {
  const hasGraphQLErrors =
    Array.isArray(graphQLErrors) && graphQLErrors.length > 0;

  if (hasGraphQLErrors) {
    graphQLErrors.forEach(error => {
      // eslint-disable-next-line no-console
      console.error(error.message);
    });
  }
};

export { authClient, workspaceEndpoint, onSuccess, onError };
