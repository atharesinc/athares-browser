import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import * as reducers from "./store/reducers";
import { loadingBarReducer } from "react-redux-loading-bar";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { BatchHttpLink } from "apollo-link-batch-http";

const link = new BatchHttpLink({
  uri: "https://api.graph.cool/simple/v1/cjrucg3gz1obq0149g3vd7nxh"
});
const client = new ApolloClient({
  link
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({ ...reducers, loadingBar: loadingBarReducer }),
  composeEnhancers(applyMiddleware(thunk))
);

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
