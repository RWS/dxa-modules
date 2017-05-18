import { combineReducers } from "./../CombineReducers";
import { IConditionsState, IConditionMap } from "./IConditions";

import showDialog, * as ShowDialog from "./showDialog";
import allConditions, * as AllConditions from "./allConditions";
import lastConditions, * as LastConditions from "./lastConditions";

const conditions = combineReducers({
    showDialog,
    allConditions,
    lastConditions
});

export default conditions;
export const isDialogVisible = (state: IConditionsState) => ShowDialog.isVisible(state.showDialog);
export const getByPubId = (state: IConditionsState, pubId: string): IConditionMap => AllConditions.getByPubId(state.allConditions, pubId);
export const getLastConditions = (state: IConditionsState, pubId: string): IConditionMap => LastConditions.getLastConditions(state.lastConditions, pubId);