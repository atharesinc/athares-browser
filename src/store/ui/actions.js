export function openSearch() {
    return async dispatch => {
        dispatch({ type: 'OPEN_SEARCH' });
    };
}
export function closeSearch() {
    return async dispatch => {
        dispatch({ type: 'CLOSE_SEARCH' });
    };
}
export function toggleSearch() {
    return async dispatch => {
        dispatch({ type: 'TOGGLE_SEARCH' });
    };
}
