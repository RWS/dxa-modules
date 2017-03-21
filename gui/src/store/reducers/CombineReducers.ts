/* tslint: disable:no-any */
const getState = (state: any, newState: any) => () => Object.freeze(Object.assign({}, state, newState));

export const combineReducers = (reducers: any) => {
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

export const handleAction = (type: string, fn: (state: any, action: any, getState: () => any) => any, defaulState: any) => {
    return (state: any, action: any, getState: () => any) => {
        return action.type === type ? fn(state, action.payload, getState) : state;
    };
};

export const combine = (...handles: any[]) => (state: any, ...rest: any[]) => handles.reduce((prevState, reducer) => reducer(prevState, ...rest), state);