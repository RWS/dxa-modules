import { ILastConditions, IConditionsPayload, IConditionMap } from "store/interfaces/Conditions";
import { handleAction } from "store/reducers/CombineReducers";
import { CONDITIONS_APPLY } from "store/actions/Actions";

const lastConditions = handleAction(CONDITIONS_APPLY,
        (state: ILastConditions, { pubId, conditions }: IConditionsPayload) => {
                const mergeLastChanged = Object.assign({}, state[pubId] || {}, conditions) as IConditionMap;
                return { ...state, [pubId]: mergeLastChanged };
        }, {});

export const getLastConditions = (state: ILastConditions, pubId: string) => pubId in state ? state[pubId] : ({} as IConditionMap);
export default lastConditions;
