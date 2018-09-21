export function updateUser(user) {
  return async dispatch => {
    dispatch({ type: "UPDATE_USER", user });
  };
}

export function updateCircle(circle) {
  return async dispatch => {
    dispatch({ type: "UPDATE_CIRCLE", circle });
  };
}

export function updateChannel(channel) {
  return async dispatch => {
    dispatch({ type: "UPDATE_CHANNEL", channel });
  };
}
export function updateRevision(revision) {
  return async dispatch => {
    dispatch({ type: "UPDATE_REVISION", revision });
  };
}
