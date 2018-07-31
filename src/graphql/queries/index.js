import gql from "graphql-tag";

/* local queries */
export const getUserLocal = gql`
    query getUserLocal {
        user @client {
            id
        }
    }
`;
/* Get current circle for adding amendment, adding channel etc. */
export const getActiveCircle = gql`
    query getActiveCircle {
        activeCircle @client {
            id
        }
    }
`;
/* Get all information from channel for circle message or dm channel */
export const getActiveChannel = gql`
    query getActiveChannel {
        activeChannel @client {
            id
        }
    }
`;

/* remote queries */

export const getUserRemote = gql`
    query getUserRemote($id: ID!) {
        User(id: $id) {
            id
            lastName
            firstName
            email
            icon
            createdAt
            uname
        }
    }
`;
export const getUserCircles = gql`
    query getUserCircles($id: ID!) {
        allCircles(filter: { users_some: { id: $id } }) {
            id
            name
            icon
        }
    }
`;
export const getOneCircle = gql`
    query getUserChannels($id: ID!) {
        Circle(id: $id) {
            id
            name
            channels {
                id
                name
                description
                channelType
            }
        }
    }
`;
export const getCircleDocs = gql`
    query getCircleDocs($id: ID!) {
        Circle(id: $id) {
            id
            name
            preamble
            amendments {
                id
                title
                text
                updatedAt
                createdAt
            }
        }
    }
`;
export const checkIfNameUnique = gql`
    query checkIfNameUnique($id: ID!, $name: String!) {
        Circle(id: $id) {
            id
            channels(filter: { name: $name }) {
                id
            }
        }
    }
`;
export const getChannelMessages = gql`
    query getChannelMessages($id: ID!) {
        Channel(id: $id) {
            id
            name
            description
            channelType
            messages {
                id
                text
                createdAt
                user {
                    id
                    firstName
                    icon
                }
            }
        }
    }
`;
export const getAllRevisions = gql`
    query getAllRevisions($circleId: ID!) {
        allRevisions(filter: { circle: { id: $circleId } }) {
            id
            title
            newText
            createdAt
            updatedAt
            ratified
            amendment {
                id
                title
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
            }
        }
    }
`;
export const getRevision = gql`
    query getRevision($id: ID!) {
        Revision(id: $id) {
            id
            oldText
            newText
            title
            ratified
            createdAt
            updatedAt
            votes {
                support
                id
                user {
                    id
                }
                updatedAt
            }
            backer {
                id
                firstName
                lastName
                icon
            }
            amendment {
                id
            }
        }
    }
`;
