import { IConditions, IConditionMap } from "store/interfaces/State";
import { CONDITIONES_LOADED, CONDITIONES_LOADING, CONDITIONES_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "../CombineReducers";

export interface IConditionsError {
    message: string;
};

export interface IConditionsErrorPayload {
    pubId: string;
    error: IConditionsError;
};

export interface IConditionsLoadedPayload {
    pubId: string;
    conditions: IConditionMap;
};

const byPubId = combine(
    handleAction(CONDITIONES_LOADED, (state, { conditions, pubId }) => ({ ...state, [pubId]: conditions }), {})
);

const loading = combine(
    handleAction(CONDITIONES_LOADING, (state: string[], pubId: string) => [...state, pubId], []),
    handleAction(CONDITIONES_LOADED, (state: string[], { pubId, conditions }: IConditionsLoadedPayload) => state.filter((id) => id !== pubId), []),
    handleAction(CONDITIONES_ERROR, (state: string[], { pubId, error }: IConditionsErrorPayload) => state.filter((id) => id !== pubId), [])
);

const errors = handleAction(CONDITIONES_ERROR, () => [], []);

export const getByPubId = (state: IConditions, pubId: string): IConditionMap => pubId in state.byPubId ? state.byPubId[pubId] : ({} as IConditionMap);
export const isDialogVisible = (state: IConditions) => state.showDialog;

export const conditions = combineReducers({
    byPubId,
    loading,
    errors
});