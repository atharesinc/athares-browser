import React from 'react';
import { withGun } from 'react-gun';

class SearchWrapper extends React.Component {
    constructor() {
        super();
        this.state = {
            searchParams: '',
            circles: [],
            channels: [],
            // users: [],
            amendments: [],
            revisions: [],
            loading: false
        };
    }
    updateText = e => {
        e.preventDefault();
        this.setState({
            searchParams: e.currentTarget.value
        });
    };
    async componentDidMount() {
        this.setState({ loading: true });
        this.props.gun.get('circles').load(data => {
            if (data) {
                let circles = Object.values(data);
                let newState = { ...this.state };
                circles.forEach(
                    ({ users, channels, revisions, amendments, ...c }) => {
                        newState.circles = [...newState.circles, c];
                        // newState.users = [...newState.users, ...Object.values(users)];
                        newState.channels = [
                            ...newState.channels,
                            ...Object.values(channels)
                        ];

                        if (c.amendments !== undefined) {
                            newState.amendments = [
                                ...newState.amendments,
                                ...Object.values(amendments)
                            ];
                        }
                        if (c.revisions) {
                            newState.revisions = [
                                ...newState.revisions,
                                ...Object.values(revisions)
                            ];
                        }
                    }
                );

                this.setState({
                    ...this.state,
                    ...newState,
                    loading: false
                });
            }
        });
    }
    hideSearch = () => {
        this.setState({
            searchParams: ''
        });
    };
    render() {
        const { searchParams, loading } = this.state;
        return (
            <div className='App'>
                <h1>Hello CodeSandbox</h1>
                <div>
                    <input
                        onBlur={this.hideSearch}
                        onChange={this.updateText}
                        value={searchParams}
                    />
                    {loading && 'Loading'}
                </div>
                {searchParams.length > 2 && !loading && (
                    <SearchResults {...this.state} />
                )}
            </div>
        );
    }
}

export default withGun(SearchWrapper);
