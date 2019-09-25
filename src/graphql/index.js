import { split, concat, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RetryLink } from 'apollo-link-retry';

let uri =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_GQL_HTTP_URL
    : process.env.REACT_APP_DEV_GQL_HTTP_URL;
// Create an http link:
const httpLink = new HttpLink({
  uri,
});

const wsUri =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_GQL_WS_URL
    : process.env.REACT_APP_DEV_GQL_WS_URL;

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: 'Bearer ' + localStorage.getItem('ATHARES_TOKEN') || '',
    },
  },
});

// create cache
const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('ATHARES_TOKEN') || '',
    },
  });

  return forward(operation);
});

const retry = new RetryLink({ attempts: { max: Infinity } });

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  concat(retry, concat(authMiddleware, httpLink)),
);

export { link, cache };
