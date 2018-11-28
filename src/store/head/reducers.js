const initialState = {
    title: null,
    description: null
};

export default function reduce(state = initialState, action = {}) {
    switch (action.type) {
        case 'UPDATE_TITLE':
            return { ...state, title: action.title };
        case 'UPDATE_DESC':
            return { ...state, description: action.description };
        default:
            return { ...initialState };
    }
}

export function pull(state, value) {
    return state.headReducers[value];
}
