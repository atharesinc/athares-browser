import React from "reactn";
import SearchResults from "./SearchResults";
import FeatherIcon from "feather-icons-react";
import { Query } from "react-apollo";
import { SEARCH_ALL } from "../graphql/queries";

import { pull } from "../store/ui/reducers";
import { updateSearchParams } from "../store/ui/actions";

function Search (){
  
    this.state = {
      circles: [],
      channels: [],
      amendments: [],
      revisions: [],
      loading: false
    };
    this._isMounted = false;
  
  const updateText = e => {
    e.preventDefault();
    props.dispatch(updateSearchParams(e.currentTarget.value));
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  const hideSearch = () => {
    this.setState({
      searchParams: ""
    });
  };
  
    const { searchParams } = props;

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

function mapStateToProps(state) {
  return {
    searchParams: pull(state, "searchParams")
  };
}
export default connect(mapStateToProps)(Search);
