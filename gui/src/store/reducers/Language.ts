import { CHANGE_LANGUAGE } from "store/actions/Actions";
import { handleAction } from "./combineReducers";

export const language = handleAction(CHANGE_LANGUAGE,
    (state: string, payload: string) => payload,
    "");