import React from 'react';
import Section from './Section';

const SearchResults = ({
    searchParams,
    circles,
    channels,
    amendments,
    revisions
}) => {
    circles = circles ? circles : [];
    channels = channels ? channels : [];
    amendments = amendments ? amendments : [];
    revisions = revisions ? revisions : [];
    return (
        <div>
            {circles.length > 0 && (
                <Section
                    search={searchParams}
                    data={circles}
                    searchOn={'name'}
                    title='circles'
                />
            )}
            {channels.length > 0 && (
                <Section
                    search={searchParams}
                    data={channels}
                    searchOn={'name'}
                    title='channels'
                />
            )}
            {amendments.length > 0 && (
                <Section
                    search={searchParams}
                    data={amendments}
                    searchOn={'name'}
                    title='amendments'
                />
            )}
            {revisions.length > 0 && (
                <Section
                    search={searchParams}
                    data={revisions}
                    searchOn={'title'}
                    title='revisions'
                />
            )}
        </div>
    );
};

export default SearchResults;
