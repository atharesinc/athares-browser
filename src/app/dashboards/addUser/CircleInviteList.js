import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import TagComponent from '../../../components/TagComponent';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import {
  SEARCH_FOR_USER,
  GET_USERS_BY_CIRCLE_ID,
} from '../../../graphql/queries';
import { graphql, Query } from 'react-apollo';
import compose from 'lodash.flowright';

class CircleInviteList extends Component {
  state = {
    search: '',
  };
  delete = i => {
    // returns the index of the selected user we'd like to remove
    let updatedListOfSelections = this.props.selectedUsers.filter(
      (u, it) => i !== it,
    );
    this.props.updateList(updatedListOfSelections);
  };
  inputChange = input => {
    if (this.props.selectedUsers.length >= 6) {
      return;
    }
    this.setState({
      search: input,
    });
  };
  addition = user => {
    const newSelectedList = [...this.props.selectedUsers, user];
    this.props.updateList(newSelectedList);
  };
  render() {
    let { selectedUsers, getUsers } = this.props;
    let suggestions = [];

    return (
      <Query
        query={SEARCH_FOR_USER}
        variables={{ text: this.state.search || 's7d9f87vs69d8fv7' }}
      >
        {({ data: { allUsers = [] } = {} }) => {
          // filter data.suggestions by users that are in selectedUsers list
          if (
            this.state.search.trim().length >= 1 &&
            selectedUsers.length < 7 &&
            allUsers &&
            getUsers.Circle
          ) {
            // display some results to the user
            // filter out names that don't meet criteria and filter out alreadys selected users
            suggestions = allUsers
              .filter(
                s =>
                  getUsers.Circle.users.findIndex(su => su.id === s.id) === -1,
              )
              .filter(s => selectedUsers.findIndex(su => su.id === s.id) === -1)
              .filter(s => s.id !== this.props.user)
              .map(s => ({
                name: s.firstName + ' ' + s.lastName + ' - ' + s.email,
                ...s,
              }));
          }
          return (
            <div className='wrapper black'>
              <ReactTags
                tags={this.props.selectedUsers}
                suggestions={suggestions}
                handleDelete={this.delete}
                handleAddition={this.addition}
                handleInputChange={this.inputChange}
                placeholder={
                  this.props.shouldPlaceholder
                    ? 'Type the name of a person'
                    : ' '
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
}

function mapStateToProps(state) {
  return {
    user: pull(state, 'user'),
    activeCircle: pull(state, 'activeCircle'),
  };
}
export default connect(mapStateToProps)(
  compose(
    graphql(GET_USERS_BY_CIRCLE_ID, {
      name: 'getUsers',
      options: ({ activeCircle }) => ({
        variables: { id: activeCircle || '' },
      }),
    }),
  )(CircleInviteList),
);
