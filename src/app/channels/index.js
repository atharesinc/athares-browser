import React, { Component } from "react";
import ChannelGroup from "./ChannelGroup";
import GovernanceChannelGroup from "./GovernanceChannelGroup";

// import Loader from "../Loader";

// import { graphql, compose } from "react-apollo";
// import gql from "graphql-tag";
/*
    Wrapper component for Channels and ChannelGroup.
    Takes as props one activeCircleObject
    {
    _id: <String>,
    name: <String>
    }
    Gets all channels belonging to this circle from graphql and renders them in respective groups
    */
export default class Channels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channels: [],
            showUserSelectModal: false
        };
    }
    render() {
        const channels = [];

        return (
            <div id="channels-wrapper">
                <div id="circle-name">
                    {"Mars"}
                    <i className="mdi mdi-plus" id="circle-options" />
                </div>
                <div id="channels-list">
                    <GovernanceChannelGroup
                        style={style.docs}
                        name={"Governance"}
                    />
                    <ChannelGroup
                        style={style.channels}
                        channelType={"group"}
                        activeChannel={this.props.activeChannel}
                        name={"Channels"}
                        channels={channels.filter(channel => {
                            return channel.channelType !== "gov";
                        })}
                    />
                    <ChannelGroup
                        style={style.dm}
                        channelType={"dm"}
                        activeChannel={this.props.activeChannel}
                        name={"Direct Messages"}
                        channels={channels.filter(channel => {
                            return channel.channelType === "dm";
                        })}
                    />
                </div>
            </div>
        );
    }
}

const style = {
    docs: {
        flex: 1
    },
    channels: {
        flex: 3
    },
    dm: {
        flex: 3
    }
};

// const getChannelsQuery = gql`
//     query getChannelsQuery($circle_id: ID!) {
//         getChannels(circle_id: $circle_id) {
//             circle_id
//             _id
//             name
//             description
//             channelType
//         }
//     }
// `;

// const getChannelByNameMutation = gql`
//     mutation getChannelByMutation($name: String!, $circle_id: ID!) {
//         getChannelByName(name: $name, circle_id: $circle_id) {
//             _id
//         }
//     }
// `;
// const getUsersByNameMutation = gql`
//     mutation getUserByMutation($name: String!) {
//         getUsersByName(name: $name) {
//             _id
//             firstName
//             lastName
//             icon
//             usersCircles {
//                 _id
//                 name
//                 description
//             }
//         }
//     }
// `;

// const createChannelMutation = gql`
//     mutation createChannelMutation(
//         $circle_id: ID!
//         $name: String!
//         $channelType: String!
//         $description: String
//     ) {
//         createChannel(
//             circle_id: $circle_id
//             name: $name
//             channelType: $channelType
//             description: $description
//         ) {
//             name
//             circle_id
//             channelType
//         }
//     }
// `;

// export default compose(
//     graphql(getChannelsQuery, {
//         name: "getChannelsQuery",
//         options: props => ({
//             variables: { circle_id: props.activeCircle._id }
//         }),
//         refetchQueries: [
//             {
//                 query: getChannelsQuery,
//                 options: props => ({
//                     variables: { circle_id: props.activeCircle._id }
//                 })
//             }
//         ]
//     }),
//     graphql(createChannelMutation, { name: "createChannelMutation" }),
//     graphql(getChannelByNameMutation, { name: "getChannelByNameMutation" }),
//     graphql(getUsersByNameMutation, { name: "getUsersByNameMutation" })
// )(Channels);
