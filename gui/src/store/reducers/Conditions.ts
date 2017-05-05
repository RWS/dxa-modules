import { IConditions } from "store/interfaces/State";
import { DIALOG_REQUEST_OPEN, DIALOG_REQUEST_CLOSE } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "./CombineReducers";

const showDialog = combine(
    handleAction(DIALOG_REQUEST_OPEN, (state: IConditions) => true, false),
    handleAction(DIALOG_REQUEST_CLOSE, (state: IConditions) => false, false)
);

export const conditions = combineReducers({
    showDialog
});