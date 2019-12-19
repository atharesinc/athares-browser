import React, { useState } from "react";
import ReactTags from "react-tag-autocomplete";
import TagComponent from "../components/TagComponent";

import { pull } from "../store/state/reducers";
import { SEARCH_FOR_USER, GET_USERS_BY_CIRCLE_ID } from "../graphql/queries";
import { graphql, Query } from "react-apollo";
import compose from "lodash.flowright";

function CircleInviteList() {
  const [search, setSearch] = useState("");
  const [user] = useGlobal("user");

  const deleteItem = i => {
    // returns the index of the selected user we'd like to remove
    let updatedListOfSelections = props.selectedUsers.filter(
      (u, it) => i !== it
    );
    props.updateList(updatedListOfSelections);
  };
  const inputChange = input => {
    if (props.selectedUsers.length >= 6) {
      return;
    }
    setSearch(input);
  };
  const addition = user => {
    const newSelectedList = [...props.selectedUsers, user];
    props.updateList(newSelectedList);
  };

  let { selectedUsers, getUsers } = props;
  let suggestions = [];

  return (
    <Query
      query={SEARCH_FOR_USER}
      variables={{ text: search || "s7d9f87vs69d8fv7" }}
    >
      {({ data: { allUsers = [] } = {} }) => {
        // filter data.suggestions by users that are in selectedUsers list
        if (
          search.trim().length >= 1 &&
          selectedUsers.length < 7 &&
          allUsers &&
          getUsers.Circle
        ) {
          // display some results to the user
          // filter out names that don't meet criteria and filter out alreadys selected users
          suggestions = allUsers
            .filter(
              s => getUsers.Circle.users.findIndex(su => su.id === s.id) === -1
            )
            .filter(s => selectedUsers.findIndex(su => su.id === s.id) === -1)
            .filter(s => s.id !== props.user)
            .map(s => ({
              name: s.firstName + " " + s.lastName + " - " + s.email,
              ...s
            }));
        }
        return (
          <div className="wrapper black">
            <ReactTags
              tags={props.selectedUsers}
              suggestions={suggestions}
              handleDelete={deleteItem}
              handleAddition={addition}
              handleInputChange={inputChange}
              placeholder={
                props.shouldPlaceholder ? "Type the name of a person" : " "
              }
              autofocus={true}
              tagComponent={TagComponent}
            />
          </div>
        );
      }}
    </Query>
  );
}

export default compose(
  graphql(GET_USERS_BY_CIRCLE_ID, {
    name: "getUsers",
    options: ({ activeCircle }) => ({
      variables: { id: activeCircle || "" }
    })
  })
)(CircleInviteList);
