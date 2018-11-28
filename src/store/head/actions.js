export function updateTitle(title) {
    return async dispatch => {
        dispatch({ type: "UPDATE_TITLE", title });
    };
}

export function updateDesc(description) {
    return async dispatch => {
        dispatch({ type: "UPDATE_DESC", description });
    };
}
