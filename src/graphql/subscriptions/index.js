import gql from "graphql-tag";

export const subToCirclesRevisions = gql`
	subscription subToCirclesRevisions($id: ID!) {
		Revision(
			filter: {
				mutation_in: [CREATED, UPDATED, DELETED]
				node: { circle: { id: $id } }
			}
		) {
			updatedFields
			mutation
			node {
				id
			}
		}
	}
`;
export const subToChannel = gql`
	subscription subToChannel($id: ID!) {
		Channel(filter: { mutation_in: UPDATED, node: { id: $id } }) {
			updatedFields
			mutation
			node {
				messages {
					text
				}
			}
		}
	}
`;

export const subCircles = gql`
	subscription subCircles($id: ID!) {
		Circle(
			filter: {
				mutation_in: [CREATED, UPDATED, DELETED]
				node: { users_some: { id: $id } }
			}
		) {
			updatedFields
			mutation
			node {
				name
				id
				icon
				amendments {
					id
					title
					text
					createdAt
					updatedAt
					revisions {
						id
						oldText
						newText
						createdAt
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
				channels {
					id
					name
					description
					channelType
					messages {
						id
						text
						createdAt
					}
				}
			}
		}
	}
`;
export const subUser = gql`
	subscription subUser($id: ID!) {
		User(filter: { mutation_in: [UPDATED], node: { id: $id } }) {
			updatedFields
			mutation
			node {
				id
				firstName
				lastName
				uname
				icon
				email
				phone
			}
		}
	}
`;
