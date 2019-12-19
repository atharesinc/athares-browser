import React from "reactn";
import SearchResults from "./SearchResults";
import FeatherIcon from "feather-icons-react";
import { Query } from "react-apollo";
import { SEARCH_ALL } from "../graphql/queries";

function Search(props) {
  const [searchParams, setSearchParams] = useGlobal("searchParams");

  const updateText = e => {
    e.preventDefault();
    setSearchParams(e.currentTarget.value);
  };

  // const hideSearch = () => {
  //   setSearchParams("");
  // };

  return (
    <Query
      query={SEARCH_ALL}
      variables={{ id: searchParams, text: searchParams }}
    >
      {({ loading, err, data = {} }) => {
        return (
          <div className="bg-theme w-100">
            <div id="search-input-wrapper" className="pv2 ph3">
              <FeatherIcon className="theme-light-alt" icon="search" />
              <input
                onChange={updateText}
                value={searchParams}
                className={"transparent-input"}
                placeholder={"Enter search text"}
              />
              {loading && <FeatherIcon className="spin white" icon="loader" />}
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

export default Search;
