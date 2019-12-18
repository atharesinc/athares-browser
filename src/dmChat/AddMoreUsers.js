import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import TagComponent from '../components/TagComponent';
import { connect } from 'react-redux';
import { pull } from '../store/state/reducers';
import { SEARCH_FOR_USER } from '../graphql/queries';
import { Query } from 'react-apollo';

class AddMoreUsers extends Component {
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
    this.setState({
      search: input,
    });
  };
  addition = user => {
    const newSelectedList = [...this.props.selectedUsers, user];
    this.props.updateList(newSelectedList);
  };
  render() {
    let { selectedUsers, existingUsers, user } = this.props;
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
            allUsers
          ) {
            // display some results to the user
            // filter out names that don't meet criteria and filter out alreadys selected users
            suggestions = allUsers
              .filter(s => existingUsers.findIndex(su => su.id === s.id) === -1)
              .filter(s => selectedUsers.findIndex(su => su.id === s.id) === -1)
              .filter(s => s.id !== user)
              .map(s => ({
                name: s.firstName + ' ' + s.lastName + ' - ' + s.email,
                ...s,
              }));
          }
          return (
            <div className='w-100 h-30 black'>
              <ReactTags
                tags={selectedUsers}
                suggestions={suggestions}
                handleDelete={this.delete}
                handleAddition={this.addition}
                handleInputChange={this.inputChange}
                placeholder={
                  this.props.shouldPlaceholder ? 'Enter a name' : ' '
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
    activeChannel: pull(state, 'activeChannel'),
  };
}
export default connect(mapStateToProps)(AddMoreUsers);
