import { CONDITIONES_LOADED, CONDITIONES_LOADING, CONDITIONES_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "../CombineReducers";
import { IConditionMap, IAllConditions, IConditionsPayload } from "./IConditions";

export interface IConditionsError {
    message: string;
};

export interface IConditionsErrorPayload {
    pubId: string;
    error: IConditionsError;
};

const byPubId = combine(
    handleAction(CONDITIONES_LOADED, (state, { conditions, pubId }) => {
        return ({ ...state, [pubId]: conditions });
    }, {})
);

const loading = combine(
    handleAction(CONDITIONES_LOADING, (state: string[], pubId: string) => [...state, pubId], []),
    handleAction(CONDITIONES_LOADED, (state: string[], { pubId }: IConditionsPayload) => state.filter((id) => id !== pubId), []),
    handleAction(CONDITIONES_ERROR, (state: string[], { pubId, error }: IConditionsErrorPayload) => state.filter((id) => id !== pubId), [])
);

const errors = handleAction(CONDITIONES_ERROR, () => [], []);

const allConditions = combineReducers({
    byPubId,
    loading,
    errors
});

export const getByPubId = (state: IAllConditions, pubId: string) => pubId in state.byPubId ? state.byPubId[pubId] : ({} as IConditionMap);

export default allConditions;