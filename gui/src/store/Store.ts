import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Main";
import { applyMiddleware, compose, createStore, Store } from "redux";

const windowQwerty = window as IWindow;
const composeEnhancers = windowQwerty.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);
/**
 *
 * @param {{}} initialState
 * @returns
 */
function configureStore(initialState: {}): Store<IState> {

    const store = createStore(
        mainReducer,
        initialState,
        enhancer
    );

    return store as Store<IState>;
}

export { configureStore };