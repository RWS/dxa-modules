import { IConditions } from "store/interfaces/State";
import { combineReducers } from './../CombineReducers';
import showDialog, * as ShowDialog from "./showDialog";

const conditions = combineReducers({
    showDialog
});

export default conditions
export const isDialogVisible = (state: IConditions) => ShowDialog.isVisible(state.showDialog);