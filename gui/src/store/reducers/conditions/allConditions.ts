import { CONDITIONS_LOADED, CONDITIONS_LOADING, CONDITIONS_ERROR } from "store/actions/Actions";
import { combineReducers, handleAction, combine } from "store/reducers/CombineReducers";
import { IConditionMap, IAllConditions, IConditionsPayload } from "store/interfaces/Conditions";

export interface IConditionsError {
    message: string;
};

export interface IConditionsErrorPayload {
    pubId: string;
    error: IConditionsError;
};

const byPubId = combine(
    handleAction(CONDITIONS_LOADED, (state, { conditions, pubId }) => ({ ...state, [pubId]: conditions }), {})
);

const loading = combine(
    handleAction(CONDITIONS_LOADING, (state: string[], pubId: string) => [...state, pubId], []),
    handleAction(CONDITIONS_LOADED, (state: string[], { pubId }: IConditionsPayload) => state.filter((id) => id !== pubId), []),
    handleAction(CONDITIONS_ERROR, (state: string[], { pubId, error }: IConditionsErrorPayload) => state.filter((id) => id !== pubId), [])
);

const errors = handleAction(CONDITIONS_ERROR, (state, { pubId, error }: IConditionsErrorPayload) => {
    return ({ ...state, [pubId]: error });
}, []);

const allConditions = combineReducers({
    byPubId,
    loading,
    errors
});

export const getByPubId = (state: IAllConditions, pubId: string) => pubId in state.byPubId ? state.byPubId[pubId] : ({} as IConditionMap);

export default allConditions;
