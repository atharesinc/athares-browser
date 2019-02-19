import gql from "graphql-tag";

export const GET_ALL_NOTICES = gql`
  {
    allNotices {
      id
      title
      text
      createdAt
      circle {
        id
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    User(id: $id) {
      id
      firstName
      lastName
      icon
      pub
    }
  }
`;

export const GET_USER_BY_ID_ALL = gql`
  query getUserByIdAll($id: ID!) {
    User(id: $id) {
      id
      firstName
      lastName
      icon
      uname
      email
      phone
      circles {
        id
      }
      revisions {
        id
        passed
      }
      votes {
        id
      }
    }
  }
`;

export const GET_CIRCLES_BY_USER_ID = gql`
  query getCirclesByUserId($id: ID!) {
    User(id: $id) {
      id
      circles {
        id
        icon
        name
      }
    }
  }
`;

export const GET_CHANNELS_BY_CIRCLE_ID = gql`
  query getChannelsByCircleId($id: ID!) {
    Circle(id: $id) {
      id
      name
      preamble
      channels {
        id
        name
        channelType
        createdAt
      }
    }
  }
`;
export const GET_CIRCLE_NAME_BY_ID = gql`
  query getCircleNameById($id: ID!) {
    Circle(id: $id) {
      name
    }
  }
`;

export const GET_MESSAGES_FROM_CHANNEL_ID = gql`
  query getMessagesByChannelId($id: ID!) {
    Channel(id: $id) {
      id
      name
      description
      messages {
        id
        text
        createdAt
        file
        fileName
        user {
          id
          icon
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_AMENDMENTS_FROM_CIRCLE_ID = gql`
  query getAmendmentsFromCircleId($id: ID!) {
    Circle(id: $id) {
      id
      name
      users {
        id
      }
      preamble
      amendments {
        id
        title
        text
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_REVISION_BY_ID = gql`
  query getRevisionById($id: ID!) {
    Revision(id: $id) {
      id
      circle {
        id
      }
      title
      oldText
      newText
      passed
      voterThreshold
      expires
      createdAt
      amendment {
        id
      }
      backer {
        id
        icon
        firstName
        lastName
      }
      votes {
        id
        support
        user {
          id
        }
      }
    }
  }
`;

export const GET_REVISIONS_FROM_CIRCLE_ID = gql`
  query getRevisionsFromCircleId($id: ID!) {
    Circle(id: $id) {
      id
      name
      preamble
      revisions {
        passed
        backer {
          id
          icon
        }
        expires
        voterThreshold
        id
        title
        newText
        createdAt
        amendment {
          id
        }
        votes {
          support
        }
      }
    }
  }
`;

export const GET_ACTIVE_REVISIONS_BY_USER_ID = gql`
  query getActiveRevisionsByUserId($id: ID!) {
    User(id: $id) {
      id
      circles {
        id
        revisions {
          expires
          passed
          voterThreshold
          id
          title
          newText
          oldText
          amendment {
            id
          }
          votes {
            id
            support
          }
        }
      }
    }
  }
`;

export const SEARCH_FOR_USER = gql`
  query searchForUser($text: String!) {
    allUsers(
      filter: {
        OR: [
          { firstName_contains: $text }
          { lastName_contains: $text }
          { email_contains: $text }
          { uname_contains: $text }
        ]
      }
    ) {
      id
      firstName
      lastName
      icon
      pub
    }
  }
`;

export const GET_USERS_BY_CIRCLE_ID = gql`
  query getUsersByCircleId($id: ID!) {
    Circle(id: $id) {
      id
      users {
        id
      }
    }
  }
`;

export const GET_DMS_BY_USER = gql`
  query getDMsByUser($id: ID!) {
    User(id: $id) {
      id
      firstName
      lastName
      channels(filter: { channelType: "dm" }) {
        id
        name
        channelType
      }
    }
  }
`;

export const GET_USER_KEYS = gql`
  query getUserKeys($user: ID!, $channel: ID) {
    User(id: $user) {
      id
      priv
      firstName
      lastName
      keys(filter: { user: { id: $user }, channel: { id: $channel } }) {
        id
        key
      }
    }
  }
`;

export const SEARCH_ALL = gql`
  query searchForUser($text: String!, $id: ID!) {
    allCircles(
      last: 5
      filter: { OR: [{ id: $id }, { name_contains: $text }] }
    ) {
      id
      name
      icon
    }
    allChannels(
      last: 5
      filter: {
        channelType_not: "dm"
        OR: [{ id: $id }, { name_contains: $text }]
      }
    ) {
      id
      name
      description
      circle {
        id
        name
      }
    }
    allRevisions(
      last: 5
      filter: { OR: [{ id: $id }, { title_contains: $text }] }
    ) {
      id
      title
      newText
      circle {
        id
        name
      }
    }
    allAmendments(
      last: 5
      filter: { OR: [{ id: $id }, { title_contains: $text }] }
    ) {
      id
      title
      text
      circle {
        id
        name
      }
    }
    allUsers(
      last: 5
      filter: {
        OR: [
          { id: $id }
          { firstName_contains: $text }
          { lastName_contains: $text }
          { email_contains: $text }
          { uname_contains: $text }
        ]
      }
    ) {
      id
      firstName
      lastName
      icon
    }
  }
`;

export const GET_INVITE_BY_ID = gql`
  query getInviteById($id: ID!) {
    Invite(id: $id) {
      id
      hasAccepted
      inviter {
        id
        firstName
        lastName
        icon
      }
      circle {
        id
        name
        icon
      }
    }
  }
`;
