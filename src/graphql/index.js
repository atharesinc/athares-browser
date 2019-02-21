import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

// Create an http link:
const httpLink = new HttpLink({
  uri: "https://api.graph.cool/simple/v1/cjrucg3gz1obq0149g3vd7nxh"
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.us-west-2.graph.cool/v1/cjrucg3gz1obq0149g3vd7nxh`,
  options: {
    reconnect: true
  }
});

// create cache
const cache = new InMemoryCache();

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

export { link, cache };
