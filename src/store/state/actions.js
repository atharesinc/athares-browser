export function updateUser(user) {
    return async dispatch => {
        dispatch({ type: "UPDATE_USER", user });
    };
}

export function updatePub(pub) {
    return async dispatch => {
        dispatch({ type: "UPDATE_PUB", pub });
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

export function circlesSync(obj) {
    return async (dispatch, getState) => {
        let { circles: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_CIRCLES", circles: items });
        }
    };
}
export function channelsSync(obj) {
    return async (dispatch, getState) => {
        let { channels: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_CHANNELS", channels: items });
        }
    };
}
export function revisionsSync(obj) {
    return async (dispatch, getState) => {
        let { revisions: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_REVISONS", revisions: items });
        }
    };
}
export function votesSync(obj) {
    return async (dispatch, getState) => {
        let { votes: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_VOTES", votes: items });
        }
    };
}
export function usersSync(obj) {
    return async (dispatch, getState) => {
        let { users: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_USERS", users: items });
        }
    };
}
export function amendmentsSync(obj) {
    return async (dispatch, getState) => {
        let { amendments: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_AMENDMENTS", amendments: items });
        }
    };
}
