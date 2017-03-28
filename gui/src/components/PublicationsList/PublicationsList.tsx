import { connect } from "react-redux";
import { PublicationsListPresentation, IPublicationsListProps } from "./PublicationsListPresentation";
import { getPubList, isPubsLoading, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";
import { find, chain } from "lodash";
import { IPublication } from "interfaces/Publication";
import { DEFAULT_LANGUAGE } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownParams: IPublicationsListProps) => {
    const { params } = ownParams;
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    //default filter with language and productFamily;
    let filter = { productFamily: params.productFamily };

    if ( selectedProductVersion ) {
        filter = {...filter, productReleaseVersion: selectedProductVersion};
    }

    // Groups publications by versionRef
    // find one we need by language or fallback language
    const publications = chain(getPubList(state, filter))
        .groupBy("versionRef")
        .values()
        .flatMap((pubsByRef: IPublication[]) => find(pubsByRef, {language: state.language})
                                             || find(pubsByRef, {language: DEFAULT_LANGUAGE}))
        .value()
        .filter(publiction => publiction !== undefined);

    return {
        publications,
        productReleaseVersions: productReleaseVersions,
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state),
        selectedProductVersion,
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
