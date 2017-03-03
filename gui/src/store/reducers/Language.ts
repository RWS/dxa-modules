import { IAction } from "store/interfaces/Action";
import { handleActions, Reducer } from "redux-actions";
import { CHANGE_LANGUAGE } from "store/actions/Actions";

export const languageReducer = handleActions({
    [CHANGE_LANGUAGE]: (state: string, action: IAction) => action.payload as string
}, "");

export { Reducer }
