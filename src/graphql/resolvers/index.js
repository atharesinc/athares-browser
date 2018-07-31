// import { getCirclesLocal, getActiveCircle } from "../queries";
// import gql from "graphql-tag";

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
        setStateFromUri: async (_, { uri }, { cache }) => {
            try {
                let deepLink = {
                    circle: uri.split("/circle/")[1].replace(/\/.*/, ""),
                    channel: uri.split("/channel/")[1]
                };
                const activeCircle = {
                    __typename: "ActiveCircle",
                    id: deepLink.circle || ""
                };
                const activeChannel = {
                    __typename: "ActiveChannel",
                    id: deepLink.channel || ""
                };
                await cache.writeData({
                    data: { activeCircle, activeChannel }
                });
                return true;
            } catch (err) {
                return false;
            }
        },
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
                await cache.reset();

                await cache.writeData({
                    data: defaults
                });

                // persistor.purge();
                // persistor.remove();
                return true;
            } catch (err) {
                return false;
            }
        }
    },
    Query: {}
};

// Based on an id, either appends the object if it's new or modifies the existing object by the same id
// function putObject(obj, arr) {
//     const doesExist = arr.findIndex(item => item.id === obj.id);
//     let newArr;
//     if (doesExist === -1) {
//         newArr = [obj, ...arr];
//     } else {
//         newArr = [...arr];
//         newArr[doesExist] = obj;
//     }
//     return newArr;
// }
