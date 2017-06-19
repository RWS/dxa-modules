import { ILastConditions, IConditionsPayload, IConditionMap } from "store/interfaces/Conditions";
import { handleAction } from "../CombineReducers";
import { CONDITIONS_APPLY } from "store/actions/Actions";

const lastConditions = handleAction(CONDITIONS_APPLY,
        (state: ILastConditions, {pubId, conditions}: IConditionsPayload) => ({...state, [pubId]: conditions}), {});

export const getLastConditions = (state: ILastConditions, pubId: string) => pubId in state ? state[pubId] : ({} as IConditionMap);
export default lastConditions;