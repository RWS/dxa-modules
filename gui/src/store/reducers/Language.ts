import { CHANGE_LANGUAGE } from "store/actions/Actions";
import { handleAction } from "store/reducers/CombineReducers";

export const language = handleAction(
    CHANGE_LANGUAGE,
    (state: string, payload: string) => payload,
    ""
);
