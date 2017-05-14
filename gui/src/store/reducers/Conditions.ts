import { IConditions } from "store/interfaces/State";
import { DIALOG_REQUEST_OPEN, DIALOG_REQUEST_CLOSE, CONDITIONES_LOADED, CONDITIONES_LOADING, CONDITIONES_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "./CombineReducers";

export interface IConditionsError {
    message: string;
};

const showDialog = combine(
    handleAction(DIALOG_REQUEST_OPEN, (state: IConditions) => true, false),
    handleAction(DIALOG_REQUEST_CLOSE, (state: IConditions) => false, false)
);

const byPubId = combine(
    handleAction(CONDITIONES_LOADED, (state, {conditions, pubId}) => ({...state, [pubId]: conditions}), {})
);

const loading = combine(
    handleAction(CONDITIONES_LOADING, (state: string[], pubId: string) => [...state, pubId], []),
    handleAction(CONDITIONES_LOADED, (state: string[], {pubId: string, conditions: IConditionMap}) => state.filter((id) => id !== pubId), []),
    handleAction(CONDITIONES_ERROR, (state: string[], {pubId: string, error: IConditionsError}) => state.filter((id) => id !== pubId), [])
);

// const errors = combine(
//     handleAction(CONDITIONES_ERROR, (state: IPageErrorsMap, error) => Object.assign({}, state, { [error.pubId]: error.message}), {}),
//     handleAction(CONDITIONES_LOADING, (state: IPageErrorsMap, pubId: string) => removeByKey(state, pubId), {})
// );


export const getByPubId = (state: IConditions, pubId: string) => pubId in state ? state.byPubId[pubId]: {};
export const conditions = combineReducers({
    showDialog,
    byPubId,
    loading,
    errors: []
});