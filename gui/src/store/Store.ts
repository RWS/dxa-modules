import * as deepAssign from "deep-assign";
import { applyMiddleware, compose, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { IWindow } from "interfaces/Window";
import { IState } from "./interfaces/State";
import { mainReducer } from "./reducers/Reducer";
import { handleAction, combine } from "./reducers/CombineReducers";
import { createAction } from "redux-actions";

const globalWindow = window as IWindow;
const composeEnhancers = globalWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));

// This is an empty initial state object, that helps to create store if don't want to fill all options
const EMPTY_STATE: IState = {
    language: "",
    conditions: {
        showDialog: false,
        allConditions: {
            byPubId: {},
            loading: [],
            errors: {}
        },
        lastConditions: {},
        editingConditions: {}
    },
    comments: {
        byPageId: {},
        loading: [],
        errors: {}
    },
    publication: {
        publicationId: "",
        pageId: "",
        anchor: ""
    },
    publications: {
        byId: {},
        isLoading: false,
        lastError: ""
    },
    pages: {
        byId: {},
        loading: [],
        errors: {}
    },
    releaseVersions: {
        byProductFamily: {}
    }
};

//need this to reset state for tests
const resetState = createAction("KARMA_RESET", (state: IState) => state);
const resetStateReducer = handleAction("KARMA_RESET", (state: IState, newState: IState): IState => newState, {});

let store: Store<IState> | undefined;
const configureStore = (initialState: {} = {}): Store<IState> => {
    const state = deepAssign({}, EMPTY_STATE, initialState);
    if (store === undefined) {
        store = createStore(combine(resetStateReducer, mainReducer), state, enhancer);
    } else {
        store.dispatch(resetState(state));
    }
    return store;
};

const getStore = () => {
    //hack method onyl for TOC and conditions, (while we haven't moved it redux state)
    //never use it otherwise
    return store as Store<IState>;
};

export { configureStore, getStore };
