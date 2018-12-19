const initialState = {
    searchOpen: false
};

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case 'OPEN_SEARCH':
            return { ...state, searchOpen: true };
        case 'CLOSE_SEARCH':
            return { ...state, searchOpen: false };
        case 'TOGGLE_SEARCH':
            return { ...state, searchOpen: !state.searchOpen };
        default:
            return { ...initialState };
    }
}

export function pull(state, value) {
    return state.uiReducers[value];
}
