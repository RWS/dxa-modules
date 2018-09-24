/* tslint:disable:no-any */

/**
 * Redux combineReducers with allowed global state for subreducers
 *
 * @param {any} reducers
 * @returns {Function}
 */
export const combineReducers = (reducers: any) => {
    const getState = (state: any, newState: any) => () => Object.freeze(Object.assign({}, state, newState));

    return (state: any, action: {}): {} => {
        const newState  = Object.keys(reducers)
            .reduce((currentState, reducerName) => {
                return Object.assign(currentState, {
                    [reducerName]: reducers[reducerName](state[reducerName], action, getState(state, currentState))
            });
        }, Object.create(null));
        return newState;
    };
};

/**
 * State action handler
 *
 * @param {string} type Action name
 * @param {Function} fn Action handler
 * @param {any} defaultState Action default state
 * @returns {Function}
 */
export const handleAction = (type: string, fn: (state: any, action: any, getState: () => any) => any, defaulState: any) => {
    return (state: any, action: any, getState: () => any) => {
        return action.type === type ? fn(state, action.payload, getState) : state;
    };
};

/**
 * Action handler combiner
 *
 * @param {any[]} handlers
 * @returns {Function}
 */
export const combine = (...handles: any[]) => (state: any, ...rest: any[]) => handles.reduce((prevState, reducer) => reducer(prevState, ...rest), state);
