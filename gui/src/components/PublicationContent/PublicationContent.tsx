import { connect } from "react-redux";
import { PublicationContentPresentation } from "@sdl/dd/PublicationContent/PublicationContentPresentation";
import { updateCurrentPublication } from "store/actions/Actions";
import { setCurrentPublicationByReleaseVersion } from "store/actions/Api";
import { getCurrentPub, getPubById, getPageById, getErrorMessage,
    isPageLoading as isPageLoadingGetter, isPublicationFound as  isPublicationFoundGetter, getReleaseVersionsForPub } from "store/reducers/Reducer";
import { IState } from "store/interfaces/State";
import { isPage, isDummyPage } from "utils/Page";
import { getLastConditions } from "../../store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId, anchor} = getCurrentPub(state);
    const publication = getPubById(state, publicationId);
    const page = getPageById(state, pageId);
    const errorMessage = getErrorMessage(state, pageId);
    const isPageLoading = isPage(page) && isDummyPage(page) && isPageLoadingGetter(state, pageId);
    const productReleaseVersions = getReleaseVersionsForPub(state, publicationId);
    const isPublicationFound = isPublicationFoundGetter(state, publicationId);
    const conditions = getLastConditions(state, publicationId)

    return {
        publication,
        page,
        publicationId,
        pageId,
        anchor,
        isPageLoading,
        errorMessage,
        productReleaseVersions,
        productReleaseVersion: publication.productReleaseVersion || "",
        isPublicationFound,
        conditions
    };
};

const mapDispatchToProps = {
    onPublicationChange: updateCurrentPublication,
    onReleaseVersionChanged: setCurrentPublicationByReleaseVersion
};

/**
 * Connector of Publication Content component for Redux
 * @export
 */
export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentPresentation);
