import { SPLITTER_POSITION_CHANGE } from "store/actions/Actions";
import { handleAction } from "store/reducers/CombineReducers";

const splitterPosition = handleAction(
    SPLITTER_POSITION_CHANGE,
    (state: string, payload: number) => payload,
    ""
);

export default splitterPosition;
