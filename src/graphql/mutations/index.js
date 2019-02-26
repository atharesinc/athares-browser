import gql from "graphql-tag";

export const CREATE_USER = gql`
  mutation CREATE_USER(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $icon: String!
    $pub: String!
    $priv: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      authProvider: { email: { email: $email, password: $password } }
      icon: $icon
      pub: $pub
      priv: $priv
    ) {
      id
      firstName
      lastName
      email
      icon
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation SIGNIN_USER($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
        firstName
        lastName
        icon
        uname
        phone
        email
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $phone: String
    $uname: String
    $icon: String!
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      uname: $uname
      icon: $icon
    ) {
      id
    }
  }
`;

export const CREATE_CIRCLE = gql`
  mutation createCircle($icon: String!, $name: String!, $preamble: String!) {
    createCircle(icon: $icon, name: $name, preamble: $preamble) {
      id
    }
  }
`;

// use this with creating circle or when inviting users
export const ADD_USER_TO_CIRCLE = gql`
  mutation addCircleToUser($circle: ID!, $user: ID!) {
    addToUserOnCircles(circlesCircleId: $circle, usersUserId: $user) {
      usersUser {
        circles {
          id
        }
      }
      circlesCircle {
        users {
          id
        }
      }
    }
  }
`;
export const CREATE_CHANNEL = gql`
  mutation createChannel(
    $name: String!
    $description: String
    $channelType: String!
  ) {
    createChannel(
      channelType: $channelType
      name: $name
      description: $description
    ) {
      id
    }
  }
`;
export const ADD_CHANNEL_TO_CIRCLE = gql`
  mutation addChannelToCircle($channel: ID!, $circle: ID!) {
    addToCircleOnChannels(
      channelsChannelId: $channel
      circleCircleId: $circle
    ) {
      circleCircle {
        id
        name
      }
      channelsChannel {
        id
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $text: String!
    $user: ID!
    $channel: ID!
    $file: String
    $fileName: String
  ) {
    createMessage(
      text: $text
      channelId: $channel
      userId: $user
      file: $file
      fileName: $fileName
    ) {
      id
    }
  }
`;

export const CREATE_REVISION = gql`
  mutation createRevision(
    $newText: String!
    $oldText: String
    $circle: ID!
    $user: ID!
    $title: String!
    $amendment: ID
    $expires: DateTime!
    $voterThreshold: Int!
  ) {
    createRevision(
      newText: $newText
      oldText: $oldText
      circleId: $circle
      backerId: $user
      title: $title
      amendmentId: $amendment
      expires: $expires
      voterThreshold: $voterThreshold
    ) {
      id
    }
  }
`;

export const CREATE_VOTE = gql`
  mutation createVote($support: Boolean!, $user: ID!, $revision: ID!) {
    createVote(support: $support, userId: $user, revisionId: $revision) {
      id
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation updateVote($vote: ID!, $support: Boolean!) {
    updateVote(id: $vote, support: $support) {
      id
      support
    }
  }
`;

export const CREATE_AMENDMENT_FROM_REVISION = gql`
  mutation createAmendmentFromRevsion(
    $text: String!
    $revision: ID!
    $title: String!
    $circle: ID!
  ) {
    updateRevision(id: $revision, passed: true) {
      passed
      id
    }
    createAmendment(text: $text, title: $title, circleId: $circle) {
      id
      title
    }
  }
`;

export const UPDATE_AMENDMENT_FROM_REVISION = gql`
  mutation createAmendmentFromRevsion(
    $text: String!
    $revision: ID!
    $title: String!
    $amendment: ID!
  ) {
    updateRevision(id: $revision, passed: true) {
      passed
      id
    }
    updateAmendment(text: $text, title: $title, id: $amendment) {
      id
      title
    }
  }
`;

export const DENY_REVISION = gql`
  mutation denyRevision($id: ID!) {
    updateRevision(id: $id, passed: false) {
      passed
      id
    }
  }
`;

export const DELETE_USER_FROM_CIRCLE = gql`
  mutation($circle: ID!, $user: ID!) {
    removeFromUserOnCircles(circlesCircleId: $circle, usersUserId: $user) {
      usersUser {
        id
      }
      circlesCircle {
        id
      }
    }
  }
`;

export const CREATE_KEY = gql`
  mutation($key: String!, $user: ID!, $channel: ID!) {
    createKey(key: $key, userId: $user, channelId: $channel) {
      id
    }
  }
`;

/* this is for adding users to dm channels, otherwise they cant discover them */
export const ADD_USER_TO_CHANNEL = gql`
  mutation addUserToChannel($user: ID!, $channel: ID!) {
    addToUsersOnChannels(channelsChannelId: $channel, usersUserId: $user) {
      usersUser {
        id
      }
      channelsChannel {
        id
      }
    }
  }
`;

export const CREATE_INVITE = gql`
  mutation createInvite($inviter: ID!, $circle: ID!) {
    createInvite(inviterId: $inviter, circleId: $circle, hasAccepted: false) {
      id
    }
  }
`;

export const UPDATE_INVITE = gql`
  mutation updateInvite($id: ID!) {
    updateInvite(id: $id, hasAccepted: true) {
      id
    }
  }
`;

export const DELETE_USER_FROM_DM = gql`
  mutation deleteUserFromDM($channel: ID!, $user: ID!) {
    removeFromUsersOnChannels(channelsChannelId: $channel, usersUserId: $user) {
      usersUser {
        id
        keys(filter: { channel: { id: $channel } }) {
          id
        }
      }
      channelsChannel {
        id
      }
    }
  }
`;

export const DELETE_USER_KEY = gql`
  mutation($id: ID!) {
    deleteKey(id: $id) {
      id
    }
  }
`;
export const UPDATE_CHANNEL_NAME = gql`
  mutation($id: ID!, $name: String!) {
    updateChannel(id: $id, name: $name) {
      id
    }
  }
`;
