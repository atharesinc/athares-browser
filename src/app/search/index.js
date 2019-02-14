import React from "react";
import SearchResults from "./SearchResults";
import FeatherIcon from "feather-icons-react";
import { Query } from "react-apollo";
import { SEARCH_ALL } from "../../graphql/queries";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchParams: "",
      circles: [],
      channels: [],
      amendments: [],
      revisions: [],
      loading: false
    };
    this._isMounted = false;
  }
  updateText = e => {
    e.preventDefault();
    this.setState({
      searchParams: e.currentTarget.value
    });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  hideSearch = () => {
    this.setState({
      searchParams: ""
    });
  };
  render() {
    const { searchParams } = this.state;

    return (
      <Query
        query={SEARCH_ALL}
        variables={{ id: searchParams, text: searchParams }}
      >
        {({ loading, err, data }) => {
          return (
            <div className="bg-theme">
              <div id="search-input-wrapper" className="pv2 ph3">
                <FeatherIcon className="theme-light-alt" icon="search" />
                <input
                  onChange={this.updateText}
                  value={searchParams}
                  className={"transparent-input"}
                  placeholder={"Enter search text"}
                />
                {loading && (
                  <FeatherIcon className="spin white" icon="loader" />
                )}
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
}

export default Search;
