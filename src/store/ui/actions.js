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
export function clearSearch() {
  return async dispatch => {
    dispatch({ type: "CLEAR_SEARCH" });
  };
}
export function updateSearchParams(searchParams) {
  return async dispatch => {
    dispatch({ type: "UPDATE_SEARCH", searchParams });
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
export function hideInstall() {
  return async dispatch => {
    dispatch({ type: "HIDE_INSTALL_APP" });
  };
}
export function showInstall() {
  return async dispatch => {
    dispatch({ type: "SHOW_INSTALL_APP" });
  };
}
