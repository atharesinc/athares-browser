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
  unreadDMs: [],
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
    case "UPDATE_DMS":
      return { ...state, dms: action.dms };
    case "ADD_UNREAD_DM":
      return { ...state, unreadDMs: action.dms };
    case "REMOVE_UNREAD_DM":
      return { ...state, unreadDMs: action.dms };
    case "LOGOUT":
      return { ...initialState };
    default:
      return state;
  }
}

export function pull(state, value) {
  return state.stateReducers[value];
}
