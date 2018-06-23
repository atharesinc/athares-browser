import { getCirclesLocal, getActiveCircle } from "../queries";
import gql from "graphql-tag";

export const defaults = {
    user: {
        __typename: "User",
        id: ""
    },
    activeCircle: {
        __typename: "ActiveCircle",
        id: ""
    },
    activeChannel: {
        __typename: "ActiveChannel",
        id: ""
    }
};

export const resolvers = {
    Mutation: {
        setUser: async (_, { id }, { cache }) => {
            try {
                const user = {
                    id,
                    __typename: "User"
                };
                await cache.writeData({ data: { user } });
                return true;
            } catch (err) {
                return false;
            }
        },
        setActiveCircle: async (_, { id }, { cache }) => {
            try {
                const activeCircle = {
                    __typename: "ActiveCircle",
                    id
                };
                const activeChannel = {
                    __typename: "ActiveChannel",
                    id: ""
                };
                // write to cache
                cache.writeData({ data: { activeCircle, activeChannel } });
                return true;
            } catch (err) {
                console.log(new Error(err));
                return false;
            }
        },
        setActiveChannel: async (_, { id }, { cache }) => {
            try {
                const activeChannel = {
                    __typename: "ActiveChannel",
                    id
                };

                cache.writeData({ data: { activeChannel } });
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        },
        logout: async (_, args, { cache }) => {
            try {
                // Use cache.reset so we don't weirdly refetch all the queries like client.resetStore
                // cache.reset();
                const user = {
                    __typename: "User",
                    id: ""
                };
                const activeCircle = {
                    __typename: "ActiveCircle",
                    id: ""
                };
                const activeChannel = {
                    __typename: "ActiveChannel",
                    id: ""
                };

                await cache.writeData({
                    data: {
                        user,
                        activeCircle,
                        activeChannel
                    }
                });
                return true;
            } catch (err) {
                return false;
            }
        }
    },
    Query: {}
};

// Based on an id, either appends the object if it's new or modifies the existing object by the same id
const putObject = (obj, arr) => {
    const doesExist = arr.findIndex(item => item.id === obj.id);
    let newArr;
    if (doesExist === -1) {
        newArr = [obj, ...arr];
    } else {
        newArr = [...arr];
        newArr[doesExist] = obj;
    }
    return newArr;
};
