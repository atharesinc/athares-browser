import React, { useState, useGlobal } from "react";
import ReactTags from "react-tag-autocomplete";
import TagComponent from "../components/TagComponent";
import swal from "sweetalert";
import { SEARCH_FOR_USER } from "../graphql/queries";
import { Query } from "react-apollo";

function DMInviteList(props) {
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
    if (props.selectedUsers.length < 6) {
      const newSelectedList = [...props.selectedUsers, user];
      props.updateList(newSelectedList);
    } else {
      swal(
        "Sorry",
        "Private groups are limited to 6 members, maybe try creating a Circle?",
        "warning"
      );
      return;
    }
  };

  let { selectedUsers } = props;
  let suggestions = [];
  return (
    <Query
      query={SEARCH_FOR_USER}
      variables={{ text: search || "s7d9f87vs69d8fv7" }}
    >
      {({ data: { allUsers = [] } = {} }) => {
        // filter data.suggestions by users that are in selectedUsers list
        if (search.trim().length >= 1 && selectedUsers.length < 7 && allUsers) {
          // display some results to the user
          // filter out names that don't meet criteria and filter out alreadys selected users
          suggestions = allUsers
            .filter(s => selectedUsers.findIndex(su => su.id === s.id) === -1)
            // .filter(s => s.id !== props.user)
            .map(s => ({
              name: s.firstName + " " + s.lastName + " - " + s.email,
              ...s
            }));
        }
        return (
          <div className="wrapper">
            <div className="white mh3">To:</div>
            <ReactTags
              tags={props.selectedUsers}
              suggestions={suggestions}
              handleDelete={deleteItem}
              handleAddition={addition}
              handleInputChange={inputChange}
              placeholder={
                props.shouldPlaceholder || suggestions.length === 0
                  ? "Enter a name"
                  : " "
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

export default DMInviteList;
