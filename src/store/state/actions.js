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
        let {
            stateReducers: { circles: items }
        } = getState();

        if (obj.list) {
            // initial only!
            items = obj.list;
            dispatch({ type: "SYNC_CIRCLES", circles: items });
        }
        if (obj.node) {
            // This has periodically fucked me, I don't know why it previously was necessary and is now not important
            // Keep an eye on this
            // on every change.
            // items.splice(obj.idx, 1, obj.node);
            // dispatch({ type: "SYNC_CIRCLES", circles: items });
        }
    };
}
export function syncDM(obj){
    return async (dispatch, getState) => {
        let {
            stateReducers: { dms: items }
        } = getState();

        if (obj.list) {
            // initial only!
            items = obj.list;
            dispatch({ type: "SYNC_DMS", dms: items });
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_DMS", dms: items });
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
export function messagesSync(obj) {
    return async (dispatch, getState) => {
        let { messages: items } = getState();
        if (obj.list) {
            // initial only!
            items = obj.list;
        }
        if (obj.node) {
            // on every change.
            items.splice(obj.idx, 1, obj.node);
            dispatch({ type: "SYNC_MESSAGES", messages: items });
        }
    };
}
export function logout() {
    return async dispatch => {
        dispatch({ type: "LOGOUT" });
        sessionStorage.clear();
    };
}

export function setChannels(channels) {
    return async dispatch => {
        dispatch({ type: "SYNC_CHANNELS", channels });
    };
}
export function setMessages(messages) {
    return async dispatch => {
        dispatch({ type: "SYNC_MESSAGES", messages });
    };
}
export function setAmendments(amendments) {
    return async dispatch => {
        dispatch({ type: "SYNC_AMENDMENTS", amendments });
    };
}
export function setRevisions(revisions) {
    return async dispatch => {
        dispatch({ type: "SYNC_REVISIONS", revisions });
    };
}
export function setVotes(votes) {
    return async dispatch => {
        dispatch({ type: "SYNC_VOTES", votes });
    };
}
export function setDMMessages(dmsgs){
    return async dispatch => {
        dispatch({ type: "SYNC_DMMESSAGES", dmsgs });
    };
}
export function addDMMessages(dmsgs){
    return async dispatch => {
        dispatch({ type: "ADD_DMMESSAGES", dmsgs });
    };
}

/* in this case and this case only, DM Messages is an object of arrays with channel name as the key and the channel's message array as the values */
export function syncDMMessages(obj){
    return async (dispatch, getState) => {
        let {
            stateReducers: { dmsgs: items }
        } = getState();

            if (obj.list) {
                items = obj.list;
                dispatch({ type: "SYNC_DMMESSAGES", dmsgs: items });
            }
            if (obj.node) {
                if(items.findIndex(i => i.id === obj.node.id) === -1){
                    dispatch({ type: "SYNC_DMMESSAGES", dmsgs: [...items, obj.node] });
                }
            }
    };
}
