import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Reducer";
import { applyMiddleware, compose, createStore, Store } from "redux";

const globalWindow = window as IWindow;
const composeEnhancers = globalWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

function configureStore(initialState: {}): Store<IState> {
    const store = createStore(mainReducer, initialState, enhancer);
    return store as Store<IState>;
}

export {configureStore};