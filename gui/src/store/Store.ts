import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Main";
import { createStore, Store } from "redux";

/**
 *
 * @param {{}} initialState
 * @returns
 */
function configureStore(initialState: {}): Store<IState> {
    const windowQwertyBecauseOfTypescriptSuck = window as IWindow;
    const store = createStore(
        mainReducer,
        initialState,
        windowQwertyBecauseOfTypescriptSuck.__REDUX_DEVTOOLS_EXTENSION__ && windowQwertyBecauseOfTypescriptSuck.__REDUX_DEVTOOLS_EXTENSION__() // tslint:disable-line
    );

    return store as Store<IState>;
}

export { configureStore };
