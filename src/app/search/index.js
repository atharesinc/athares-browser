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
  async componentDidMount() {
    // this._isMounted = true;
    // this.setState({ loading: true });
    // this.props.gun.get("circles").load(data => {
    //   console.log(data);
    //   if (data) {
    //     let circles = Object.values(data);
    //     let newState = { ...this.state };
    //     circles.forEach(({ users, channels, revisions, amendments, ...c }) => {
    //       newState.circles = [...newState.circles, c];
    //       if (channels !== undefined) {
    //         channels = Object.values(channels).map(o => ({
    //           ...o,
    //           circleName: c.name
    //         }));
    //         newState.channels = [
    //           ...newState.channels,
    //           ...Object.values(channels)
    //         ];
    //       }
    //       if (amendments !== undefined) {
    //         amendments = Object.values(amendments).map(o => ({
    //           ...o,
    //           circleName: c.name
    //         }));
    //         newState.amendments = [
    //           ...newState.amendments,
    //           ...Object.values(amendments)
    //         ];
    //       }
    //       if (revisions !== undefined) {
    //         revisions = Object.values(revisions).map(o => ({
    //           ...o,
    //           circleName: c.name
    //         }));
    //         newState.revisions = [
    //           ...newState.revisions,
    //           ...Object.values(revisions)
    //         ];
    //       }
    //     });
    //     console.log(newState);
    //     this._isMounted &&
    //       this.setState({
    //         ...this.state,
    //         ...newState,
    //         loading: false
    //       });
    //   }
    // });
  }
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
