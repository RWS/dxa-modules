import { PublicationContentPresentation } from "./PublicationContentPresentation";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { getCurrentPub, getPubById, getPageById, getErrorMessage, isPageLoading as isPageLoadingGetter } from "store/reducers/Reducer";
import { isPage, isDummyPage } from "utils/Page";

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId, anchor } = getCurrentPub(state);
    const publication = getPubById(state, publicationId);
    const page = getPageById(state, pageId);
    const errorMessage = getErrorMessage(state, pageId);
    const isPageLoading = isPage(page) && !isDummyPage(page) && isPageLoadingGetter(state, pageId);

    return {
        publication,
        page,
        publicationId,
        pageId,
        anchor,
        isPageLoading,
        errorMessage };
};

const mapDispatchToProps = {
    onPulicationChange: publicationRouteChanged
};

export const PublicationContent = connect(mapStateToProps, mapDispatchToProps)(PublicationContentPresentation);
