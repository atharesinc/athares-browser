import React, { Component } from 'react';
import ReactTags from 'react-tag-autocomplete';
import TagComponent from '../../../components/TagComponent';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { pull } from '../../../store/state/reducers';
import { SEARCH_FOR_USER } from '../../../graphql/queries';
import { Query } from 'react-apollo';

class DMInviteList extends Component {
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
    if (this.props.selectedUsers.length < 6) {
      const newSelectedList = [...this.props.selectedUsers, user];
      this.props.updateList(newSelectedList);
    } else {
      swal(
        'Sorry',
        'Private groups are limited to 6 members, maybe try creating a Circle?',
        'warning',
      );
      return;
    }
  };
  render() {
    let { selectedUsers } = this.props;
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
              .filter(s => selectedUsers.findIndex(su => su.id === s.id) === -1)
              // .filter(s => s.id !== this.props.user)
              .map(s => ({
                name: s.firstName + ' ' + s.lastName + ' - ' + s.email,
                ...s,
              }));
          }
          return (
            <div className='wrapper'>
              <div className='white mh3'>To:</div>
              <ReactTags
                tags={this.props.selectedUsers}
                suggestions={suggestions}
                handleDelete={this.delete}
                handleAddition={this.addition}
                handleInputChange={this.inputChange}
                placeholder={
                  this.props.shouldPlaceholder || suggestions.length === 0
                    ? 'Enter a name'
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
  };
}
export default connect(mapStateToProps)(DMInviteList);
