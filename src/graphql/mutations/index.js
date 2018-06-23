import gql from "graphql-tag";

/* local mutations */
export const setUser = gql`
    mutation setUser($id: ID!) {
        setUser(id: $id) @client
    }
`;
export const setActiveCircle = gql`
    mutation setActiveCircle($id: ID!) {
        setActiveCircle(id: $id) @client
    }
`;
export const setActiveChannel = gql`
    mutation setActiveChannel($id: ID!) {
        setActiveChannel(id: $id) @client
    }
`;
export const logoutMutation = gql`
    mutation logoutMutation {
        logout @client
    }
`;
/* remote mutations */
export const createUser = gql`
    mutation createUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
    ) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            authProvider: { email: { email: $email, password: $password } }
        ) {
            id
            lastName
            firstName
            email
            icon
            createdAt
            phone
            uname
        }
    }
`;

export const signinUser = gql`
    mutation signinUser($email: String!, $password: String!) {
        signinUser(email: { email: $email, password: $password }) {
            user {
                id
                lastName
                firstName
                email
                icon
                createdAt
                phone
                uname
            }
        }
    }
`;
export const createCircle = gql`
    mutation createCircle(
        $name: String!
        $preamble: String!
        $icon: String!
        $usersIds: [ID!]!
    ) {
        createCircle(
            name: $name
            preamble: $preamble
            icon: $icon
            usersIds: $usersIds
        ) {
            id
        }
    }
`;
export const createChannel = gql`
    mutation createChannel(
        $name: String!
        $circleId: ID!
        $description: String
        $channelType: String!
    ) {
        createChannel(
            name: $name
            circleId: $circleId
            channelType: $channelType
            description: $description
        ) {
            id
        }
    }
`;
export const createMessage = gql`
    mutation createMessage($text: String!, $userId: ID!, $channelId: ID!) {
        createMessage(text: $text, userId: $userId, channelId: $channelId) {
            id
            text
            user {
                id
                firstName
                icon
            }
            createdAt
        }
    }
`;
export const createRevision = gql`
    mutation createRevision(
        $circleID: ID!
        $backerID: ID!
        $title: String!
        $oldText: String
        $newText: String!
    ) {
        createRevision(
            ratified: false
            title: $title
            oldText: $oldText
            newText: $newText
            circleId: $circleID
            backerId: $backerID
        ) {
            id
            ratified
        }
    }
`;
export const updateCircleIcon = gql`
    mutation updateCircleIcon($id: ID!, $icon: String!) {
        updateCircle(id: $id, icon: $icon) {
            id
            icon
        }
    }
`;
export const updateUser = gql`
    mutation(
        $id: ID!
        $firstName: String
        $uname: String
        $lastName: String
        $icon: String
        $phone: String
    ) {
        updateUser(
            id: $id
            firstName: $firstName
            uname: $uname
            lastName: $lastName
            icon: $icon
            phone: $phone
        ) {
            firstName
            uname
            lastName
            icon
            phone
        }
    }
`;

export const createVote = gql`
    mutation createVote($support: Boolean!, $revisionId: ID!, $userId: ID!) {
        createVote(
            support: $support
            revisionId: $revisionId
            userId: $userId
        ) {
            id
        }
    }
`;

export const updateVote = gql`
    mutation updateVote($support: Boolean!, $id: ID!) {
        updateVote(id: $id, support: $support) {
            id
        }
    }
`;
