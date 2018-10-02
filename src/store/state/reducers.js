const initialState = {
    user: null,
    activeCircle: null,
    activeChannel: null,
    activeRevision: null,
    pub: null,
    circles: [],
    channels: [],
    revisions: [],
    votes: [],
    users: [],
    amendments: []
};

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case "UPDATE_USER":
            return { ...state, user: action.user };
        case "UPDATE_CIRCLE":
            return { ...state, activeCircle: action.circle };
        case "UPDATE_PUB":
            return { ...state, pub: action.pub };
        case "UPDATE_CHANNEL":
            return { ...state, activeChannel: action.channel };
        case "UPDATE_REVISION":
            return { ...state, activeRevision: action.revision };
        case "SYNC_CIRCLES":
            return { ...state, circles: action.circles };
        case "SYNC_CHANNELS":
            return { ...state, circles: action.channels };
        case "SYNC_USERS":
            return { ...state, circles: action.users };
        case "SYNC_AMENDMENTS":
            return { ...state, circles: action.amendments };
        case "SYNC_VOTES":
            return { ...state, circles: action.votes };
        case "SYNC_REVISIONS":
            return { ...state, circles: action.circles };
        default:
            return state;
    }
}

export function pull(state, value) {
    return state.stateReducers[value];
}
