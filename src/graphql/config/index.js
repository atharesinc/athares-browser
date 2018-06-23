// import { ApolloClient } from "apollo-client";
// import { ApolloLink } from "apollo-link";
// import { withClientState } from "apollo-link-state";
// import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) =>
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			)
		);
	}
	if (networkError) {
		console.log(`[Network error]: ${networkError}`);
	}
});

export default errorLink;
