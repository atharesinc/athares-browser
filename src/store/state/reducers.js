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
    amendments: [],
    messages: [],
    dms: [],
    dmsgs: []
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
        case "SYNC_DMS":
            return { ...state, dms: action.dms };
        case "SYNC_DMMESSAGES":
            return {...state, dmsgs: action.dmsgs};
        case "SYNC_CHANNELS":
            return { ...state, channels: action.channels };
        case "SYNC_USERS":
            return { ...state, users: action.users };
        case "SYNC_AMENDMENTS":
            return { ...state, amendments: action.amendments };
        case "SYNC_VOTES":
            return { ...state, votes: action.votes };
        case "SYNC_REVISIONS":
            return { ...state, revisions: action.revisions };
        case "SYNC_MESSAGES":
            return { ...state, messages: action.messages };
        case "ADD_DMMESSAGES":
            return { ...state, dmsgs: [...state.dmsgs, ...action.dmsgs] };
        case "LOGOUT":
            return { ...initialState };
        default:
            return state;
    }
}

export function pull(state, value) {
    return state.stateReducers[value];
}