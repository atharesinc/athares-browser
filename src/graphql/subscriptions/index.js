import gql from 'graphql-tag';

export const SUB_TO_MESSAGES_BY_CHANNEL_ID = gql`
  subscription subToMessages($id: ID!) {
    Messages(
      filter: {
        mutation_in: create
        node: { channel: { id: { equals: $id } } }
      }
    ) {
      node {
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

export const SUB_TO_DMS_BY_USER = gql`
  subscription subtoDMs($ids: [ID!]!) {
    Messages(
      filter: {
        mutation_in: create
        node: {
          channel: { AND: { id: { in: $ids }, channelType: { equals: "dm" } } }
        }
      }
    ) {
      node {
        id
        user {
          id
          firstName
        }
        channel {
          id
        }
      }
    }
  }
`;

export const SUB_TO_ALL_CIRCLES_CHANNELS = gql`
  subscription subToCallCirclesChannel($ids: [ID!]!) {
    Messages(
      filter: {
        mutation_in: create
        node: {
          channel: {
            AND: { id: { in: $ids }, channelType: { equals: "group" } }
          }
        }
      }
    ) {
      node {
        id
        user {
          id
        }
        channel {
          id
        }
      }
    }
  }
`;

export const SUB_TO_CIRCLES_AMENDMENTS = gql`
  subscription($id: ID!) {
    Amendments(
      filter: {
        mutation_in: [create, update, delete]
        node: { circle: { id: { equals: $id } } }
      }
    ) {
      previousValues {
        id
      }
      mutation
      node {
        id
        title
        text
        revision {
          passed
          id
        }
        createdAt
        updatedAt
      }
    }
  }
`;
export const SUB_TO_CIRCLES_CHANNELS = gql`
  subscription($id: ID!) {
    Channels(
      filter: {
        mutation_in: [create, update, delete]
        node: { circle: { id: { equals: $id } } }
      }
    ) {
      node {
        id
        name
        channelType
        createdAt
      }
    }
  }
`;

export const SUB_TO_DM_CHANNELS = gql`
  subscription($id: ID!) {
    Channels(
      filter: {
        mutation_in: [create, delete, update]
        node: { users: { every: { id: { equals: $id } } } }
      }
    ) {
      mutation
      node {
        id
        name
        channelType
        users {
          items {
            id
          }
        }
      }
    }
  }
`;
