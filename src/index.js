import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import localforage from "localforage";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { createHttpLink } from "apollo-link-http";
// import { onError } from "apollo-link-error";
import { defaults, resolvers } from "./graphql/resolvers";
import { persistCache } from "apollo-cache-persist";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const cache = new InMemoryCache({});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
    uri: `wss://subscriptions.us-west-2.graph.cool/v1/cjfkj77t63cgt01543zhvxfo6`,
    options: {
        reconnect: true
    }
});

//Create Http Link
const httpLink = createHttpLink({
    uri: "https://api.graph.cool/simple/v1/cjfkj77t63cgt01543zhvxfo6"
});

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
// Create Error Link
// const errorLink = onError(({ graphQLErrors, networkError }) => {
//     if (graphQLErrors) {
//         graphQLErrors.map(({ message, locations, path }) =>
//             console.log(
//                 `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//             )
//         );
//     }
//     if (networkError) {
//         console.log(`[Network error]: ${networkError}`);
//     }
// });
const stateLink = withClientState({ resolvers, cache, defaults });

persistCache({
    cache,
    storage: localforage
}).then(async () => {
    const client = new ApolloClient({
        cache,
        link: ApolloLink.from([stateLink, link])
    });

    // client.resetStore();

    ReactDOM.render(
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>,
        document.getElementById("root")
    );
});
