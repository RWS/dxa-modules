import * as deepAssign from "deep-assign";
import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Reducer";
import { applyMiddleware, compose, createStore, Store } from "redux";

const globalWindow = window as IWindow;
const composeEnhancers = globalWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

// This is an empty initial state object,
// that help to crate store if don't wnat to fill all options
const EMPTY_STATE: IState = {
    language: "",
    publication: {
        publicationId: "",
        pageId: "",
        anchor: ""
    },
    publications: {byId: {}},
    pages: {
        byId: {},
        loading: [],
        errors: {}
    }
};

const configureStore = (initialState: {} = {}): Store<IState> => {
    const store = createStore(mainReducer, deepAssign({}, EMPTY_STATE, initialState), enhancer);
    return store as Store<IState>;
};

export {configureStore};