import gql from "graphql-tag";

export const SUB_TO_MESSAGES_BY_CHANNEL_ID = gql`
  subscription subToMessages($id: ID!) {
    Message(filter: { mutation_in: CREATED, node: { channel: { id: $id } } }) {
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
    Message(
      filter: { mutation_in: CREATED, node: { channel: { id_in: $ids } } }
    ) {
      node {
        id
        channel {
          id
        }
      }
    }
  }
`;
