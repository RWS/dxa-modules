import * as deepAssign from "deep-assign";
import { applyMiddleware, compose, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Reducer";

const globalWindow = window as IWindow;
const composeEnhancers = globalWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

// This is an empty initial state object, that helps to create store if don't want to fill all options
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