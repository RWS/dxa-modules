import { connect } from "react-redux";
import { PublicationsListPresentation, IPublicationsListProps, IPublicationsListPropsParams } from "./PublicationsListPresentation";
import { getPubList, isPubsLoading, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";
import { localization } from "services/common/LocalizationService";
import { String } from "utils/String";

const productFamily = (params: IPublicationsListPropsParams): string | null => {
    return (String.normalize(params.productFamily) === String.normalize(localization.formatMessage("productfamilies.unknown.title"))) ? null : params.productFamily;
};

const productReleaseVersion = (value: string): string | null => {
    return (String.normalize(value) === String.normalize(localization.formatMessage("productreleaseversions.unknown.title"))) ? null : value;
};

const mapStateToProps = (state: IState, ownProps: IPublicationsListProps) => {
    const { params } = ownProps;
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    //default filter with language and productFamily;
    let filter = { language: state.language, productFamily: productFamily(params)};

    if ( selectedProductVersion ) {
        filter = {...filter, productReleaseVersion: productReleaseVersion(selectedProductVersion)};
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
