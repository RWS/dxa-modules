import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { isPubsLoading, getReleaseVersionsForPub, normalizeProductFamily,
    normalizeProductReleaseVersion, translateProductReleaseVersions,
    getPubListRepresentatives } from "store/reducers/Reducer";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";
import { PublicationsListPresentation, IPublicationsListProps } from "@sdl/dd/PublicationsList/PublicationsListPresentation";

const mapStateToProps = (state: IState, ownProps: IPublicationsListProps) => {
    const { params } = ownProps;
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    let filter = { productFamily: normalizeProductFamily(params) };
    if ( selectedProductVersion ) {
        filter = {...filter, productReleaseVersion: normalizeProductReleaseVersion(selectedProductVersion)};
    }
    const publications = getPubListRepresentatives(state, filter);

    return {
        publications,
        productReleaseVersions: translateProductReleaseVersions(productReleaseVersions),
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state),
        selectedProductVersion: selectedProductVersion,
        uiLanguage: state.language
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
