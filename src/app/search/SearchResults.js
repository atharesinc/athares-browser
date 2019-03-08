import React from "react";
import Section from "./Section";

const SearchResults = ({
  searchParams,
  allCircles: circles,
  allChannels: channels,
  allAmendments: amendments,
  allRevisions: revisions,
  allUsers: users
}) => {
  circles = circles ? circles : [];
  channels = channels ? channels : [];
  amendments = amendments ? amendments : [];
  revisions = revisions ? revisions : [];
  users = users ? users : [];

  return (
    <div>
      {circles.length > 0 && (
        <Section
          search={searchParams}
          data={circles}
          searchOn={"name"}
          title="circles"
        />
      )}
      {channels.length > 0 && (
        <Section
          search={searchParams}
          data={channels}
          searchOn={"name"}
          title="channels"
        />
      )}
      {amendments.length > 0 && (
        <Section
          search={searchParams}
          data={amendments}
          searchOn={"title"}
          title="amendments"
        />
      )}
      {revisions.length > 0 && (
        <Section
          search={searchParams}
          data={revisions}
          searchOn={"title"}
          title="revisions"
        />
      )}
      {users.length > 0 && (
        <Section
          search={searchParams}
          data={users}
          searchOn={"firstName"}
          title="users"
        />
      )}
    </div>
  );
};

export default SearchResults;
