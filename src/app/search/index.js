import React from 'react';
import SearchResults from './SearchResults';
import FeatherIcon from 'feather-icons-react';
import { withGun } from 'react-gun';

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            searchParams: '',
            circles: [],
            channels: [],
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
                        if (c.amendments !== undefined) {
                            newState.channels = [
                                ...newState.channels,
                                ...Object.values(channels)
                            ];
                        }
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
            <div className='bg-theme'>
                <div id='search-input-wrapper' className='pv2 ph3'>
                    <FeatherIcon className='theme-light-alt' icon='search' />
                    <input
                        onChange={this.updateText}
                        value={searchParams}
                        className={'transparent-input'}
                        placeholder={'Enter search text'}
                    />
                    {loading && (
                        <FeatherIcon className='spin white' icon='loader' />
                    )}
                </div>
                {searchParams.length > 2 && !loading && (
                    <SearchResults {...this.state} />
                )}
            </div>
        );
    }
}

export default withGun(Search);
