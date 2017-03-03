import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Main";
import { createStore, Store } from "redux";

/**
 *
 * @param {{}} initialState
 * @returns
 */
function configureStore(initialState: {}): Store<IState> {

    const store = createStore(
        mainReducer,
        initialState
    );

    return store as Store<IState>;
}

export { configureStore };
