import React, { useGlobal } from 'reactn';
import SearchResults from './SearchResults';
import { Loader, Search } from 'react-feather';
import { Query } from 'react-apollo';
import { SEARCH_ALL } from '../graphql/queries';

function SearchComponent(props) {
  const [searchParams, setSearchParams] = useGlobal('searchParams');

  const updateText = e => {
    e.preventDefault();
    setSearchParams(e.currentTarget.value);
  };

  return (
    <Query
      query={SEARCH_ALL}
      variables={{ id: searchParams, text: searchParams }}
    >
      {({ loading, err, data = {} }) => {
        return (
          <div className='bg-theme w-100'>
            <div id='search-input-wrapper' className='pv2 ph3'>
              <Search className='theme-light-alt' />
              <input
                onChange={updateText}
                value={searchParams}
                className={'transparent-input'}
                placeholder={'Enter search text'}
              />
              {loading && <Loader className='spin white' />}
            </div>
            {searchParams.length > 2 && !loading && (
              <SearchResults {...data} searchParams={searchParams} />
            )}
          </div>
        );
      }}
    </Query>
  );
}

export default SearchComponent;
