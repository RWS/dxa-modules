import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { isPubsLoading, getPubListErrorMessage } from "store/reducers/Reducer";
import { fetchProductFamilies } from "store/actions/Api";
import { ProductFamiliesListPresentation } from "@sdl/dd/container/ProductFamiliesList/ProductFamiliesListPresentation";

const mapStateToProps = (state: IState) => {
    const error = getPubListErrorMessage(state);
    const productFamilies = state.productFamilies;

    return {
        error: error,
        productFamilies,
        isLoading: productFamilies.length === 0 && isPubsLoading(state)
    };
};

const dispatchToProps = {
    fetchProductFamilies
};

/**
 * Connector of Product families List component for Redux
 *
 * @export
 */
export const ProductFamiliesList = connect(mapStateToProps, dispatchToProps)(ProductFamiliesListPresentation);
