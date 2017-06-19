import { combine, handleAction } from "../CombineReducers";
import { DIALOG_REQUEST_CLOSE, CONDITIONS_EDITING_CHANGE} from "store/actions/Actions";
import { IConditionMap } from "store/interfaces/Conditions";

const emptyEditingConditions: IConditionMap = {};
const editingConditions = combine(
    handleAction(DIALOG_REQUEST_CLOSE, (state: IConditionMap) => emptyEditingConditions, emptyEditingConditions),
    handleAction(CONDITIONS_EDITING_CHANGE,
        (state: IConditionMap, newCondtions: IConditionMap) => {
            return {...state, ...newCondtions};
        }, emptyEditingConditions)
);

export const getConditions = (state: IConditionMap) => state;

export default editingConditions;