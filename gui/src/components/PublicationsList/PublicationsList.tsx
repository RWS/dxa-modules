import { connect } from "react-redux";
import { find, chain } from "lodash";
import { IState } from "store/interfaces/State";
import { IPublication } from "interfaces/Publication";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { PublicationsListPresentation, IPublicationsListProps, IPublicationsListPropsParams } from "./PublicationsListPresentation";
import { getPubList, isPubsLoading, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";
import { DEFAULT_LANGUAGE, localization } from "services/common/LocalizationService";
import { String } from "utils/String";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE, DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION } from "models/Publications";

const productFamily = (params: IPublicationsListPropsParams): string | null =>
    String.normalize(params.productFamily) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE) ? null : params.productFamily;

const productReleaseVersion = (value: string): string | null =>
    String.normalize(value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION) ? null : value;

const translateSelectedProductVersion = (value: string): string =>
    String.normalize(value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION) ? localization.formatMessage("productreleaseversions.unknown.title") : value;

const translateProductReleaseVersions = (versions: IProductReleaseVersion[]): IProductReleaseVersion[] => {
    return versions && versions.map(version => {
        let { value, title } = version;

        if (String.normalize(version.value) === String.normalize(DEFAULT_UNKNOWN_PRODUCT_RELEASE_VERSION)) {
            value = String.normalize(localization.formatMessage("productreleaseversions.unknown.title"));
            title = localization.formatMessage("productreleaseversions.unknown.title");
        };

        return { ...version, value, title };
    });
};

const mapStateToProps = (state: IState, ownProps: IPublicationsListProps) => {
    const { params } = ownProps;
    const productReleaseVersions = getReleaseVersionsForPub(state, params.productFamily);
    const firstInAlist = productReleaseVersions && productReleaseVersions.length ? productReleaseVersions[0].title : "";
    const selectedProductVersion = params.productReleaseVersion ? params.productReleaseVersion : firstInAlist;

    //default filter with language and productFamily;
    let filter = { productFamily: productFamily(params) };

    if ( selectedProductVersion ) {
        filter = {...filter, productReleaseVersion: productReleaseVersion(selectedProductVersion)};
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
        productReleaseVersions: translateProductReleaseVersions(productReleaseVersions),
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state),
        selectedProductVersion: translateSelectedProductVersion(selectedProductVersion),
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
