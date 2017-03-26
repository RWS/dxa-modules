import { connect } from "react-redux";
import { PublicationsListPresentation, IPublicationsListProps } from "./PublicationsListPresentation";
import { getPubList, isPubsLoading, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { fetchProductReleaseVersionsByProductFamily } from "store/actions/Api";

const mapStateToProps = (state: IState, ownParams: IPublicationsListProps) => {
    const { params } = ownParams;
    //default filter with language and productFamily;
    let filter = { language: state.language, productFamily: params.productFamily };

    if ( params.productReleaseVersion ) {
        filter = {...filter, productReleaseVersion:  params.productReleaseVersion};
    }
    const publications = getPubList(state, filter);
    return {
        publications,
        productReleaseVersions: getReleaseVersionsForPub(state, params.productFamily),
        // dont' show spinner if there are publications cached
        isLoading: publications.length === 0 && isPubsLoading(state)
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
