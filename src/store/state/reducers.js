const initialState = {
  user: null,
  activeCircle: null,
  activeChannel: null,
  activeRevision: null,
  pub: null
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
    default:
      return state;
  }
}

export function pull(state, value) {
  return state.stateReducers[value];
}
