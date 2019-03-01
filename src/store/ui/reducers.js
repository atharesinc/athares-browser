const initialState = {
  searchOpen: false,
  dmSettings: false,
  showAddMoreUsers: false,
  searchParams: "",
  showInstall: false
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case "OPEN_SEARCH":
      return { ...state, searchOpen: true };
    case "CLOSE_SEARCH":
      return { ...state, searchOpen: false };
    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen };
    case "CLOSE_DM_SETTINGS":
      return { ...state, dmSettings: false };
    case "OPEN_DM_SETTINGS":
      return { ...state, dmSettings: true };
    case "TOGGLE_ADD_USERS":
      return { ...state, showAddMoreUsers: !state.showAddMoreUsers };
    case "UPDATE_SEARCH":
      return { ...state, searchParams: action.searchParams };
    case "HIDE_INSTALL_APP":
      return { ...state, showInstall: false };
    case "SHOW_INSTALL_APP":
      return { ...state, showInstall: true };
    default:
      return { ...initialState };
  }
}

export function pull(state, value) {
  return state.uiReducers[value];
}
