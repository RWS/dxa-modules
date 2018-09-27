import { IProductFamily } from "interfaces/ProductFamily";
import { PRODUCT_FAMILIES_LOADED } from "store/actions/Actions";
import { handleAction } from "store/reducers/CombineReducers";

export const productFamilies = handleAction(
    PRODUCT_FAMILIES_LOADED,
    (state: IProductFamily[], payload: IProductFamily[]): IProductFamily[] => payload,
    {}
);

export default productFamilies;
