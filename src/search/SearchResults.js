import React from 'reactn';
import Section from './Section';

const SearchResults = ({
  searchParams,
  circlesList: circles,
  channelsList: channels,
  amendmentsList: amendments,
  revisionsList: revisions,
  usersList: users,
}) => {
  circles = circles.items ? circles.items : [];
  channels = channels.items ? channels.items : [];
  amendments = amendments.items ? amendments.items : [];
  revisions = revisions.items ? revisions.items : [];
  users = users.items ? users.items : [];

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
          searchOn={'title'}
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
      {users.length > 0 && (
        <Section
          search={searchParams}
          data={users}
          searchOn={'firstName'}
          title='users'
        />
      )}
    </div>
  );
};

export default SearchResults;
