import React from 'reactn';

// https://codesandbox.io/s/q3mqkny5o9
import { X, Search } from 'react-feather';
import { Query } from 'react-apollo';
import { GET_USER_BY_ID } from '../graphql/queries';

const TopNav = ({ showSearch = false, ...props }) => {
  return (
    <Query
      query={GET_USER_BY_ID}
      variables={{ id: props.user || '' }}
      pollInterval={2000}
    >
      {({ loading, err, data = {} }) => {
        let user = null;
        if (data.User) {
          user = data.User;
        }
        return (
          <div
            className={`mobile-top-nav w-100 v-mid bg-theme-dark flex-row justify-between items-center pv2 ph3 ${
              props.hide ? 'dn' : 'flex'
            }`}
          >
            <img
              src={user ? user.icon : '/img/user-default.png'}
              className='ba b--white br-100 w2 h2 bw1'
              alt='Menu'
              onClick={props.toggleMenu}
            />

            {showSearch ? (
              <X
                className='white w2 h2'
                style={{ height: '1.5em', width: '1.5em' }}
                onClick={props.toggleOpenSearch}
              />
            ) : (
              <Search
                className='white w2 h2'
                style={{ height: '1.5em', width: '1.5em' }}
                onClick={props.toggleOpenSearch}
              />
            )}
          </div>
        );
      }}
    </Query>
  );
};

export default TopNav;
