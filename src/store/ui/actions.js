export function openSearch() {
  return async dispatch => {
    dispatch({ type: "OPEN_SEARCH" });
  };
}
export function closeSearch() {
  return async dispatch => {
    dispatch({ type: "CLOSE_SEARCH" });
  };
}
export function toggleSearch() {
  return async dispatch => {
    dispatch({ type: "TOGGLE_SEARCH" });
  };
}
export function closeDMSettings() {
  return async dispatch => {
    dispatch({ type: "CLOSE_DM_SETTINGS" });
  };
}
export function openDMSettings() {
  return async dispatch => {
    dispatch({ type: "OPEN_DM_SETTINGS" });
  };
}
export function toggleAddUsers() {
  return async dispatch => {
    dispatch({ type: "TOGGLE_ADD_USERS" });
  };
}
