import { connect } from "react-redux";
import { PublicationsListPresentation, IPublicationsListProps } from "./PublicationsListPresentation";
import { getPubList, isPubsLoading, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";

const mapStateToProps = (state: IState, ownParams: IPublicationsListProps) => {
    const { params } = ownParams;
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    //default filter with language and productFamily;
    let filter = { language: state.language, productFamily: params.productFamily };

    if ( selectedProductVersion ) {
        filter = {...filter, productReleaseVersion: selectedProductVersion};
    }
    const publications = getPubList(state, filter);
    return {
        publications,
        productReleaseVersions: productReleaseVersions,
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state),
        selectedProductVersion
    };
};

const dispatchToProps = {
    fetchProductReleaseVersionsByProductFamily
};
/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const PublicationsList = connect(mapStateToProps, dispatchToProps)(PublicationsListPresentation);
