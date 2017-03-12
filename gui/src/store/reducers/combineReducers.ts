/* tslint: disable */
export const combineReducers = ( reducers: any ) => {
    return (state: any, action: {}): {} => {
        console.log('Before', state)
        const getState = (state: any, newState: any) => () => Object.freeze(Object.assign({}, state, newState));

        const newState  = Object.keys(reducers).reduce((newState, reducerName) => {
            return Object.assign(newState, {
                [reducerName]: reducers[reducerName](state[reducerName], action, getState(state, newState))
            });
        }, Object.create(null));

        console.log("after", newState);
        return newState;
    }
}

export const handleAction = (type: string, fn: (state: any, action: any, getState: () => any) => any, defaulState: any) => {
    return (state: any, action:any, getState: () => any) => {
        return action.type === type ? fn(state, action.payload, getState) : state;
    }
}

export const combine = (...handles: any[]) => (state: any, ...rest: any[]) => handles.reduce((prevState, reducer) => reducer(prevState, ...rest), state);