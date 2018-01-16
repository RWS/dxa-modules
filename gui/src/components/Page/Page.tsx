import { connect } from "react-redux";
import { PagePresentation, IPageProps } from "./PagePresentation";
import { IState } from "store/interfaces/State";
import { getCurrentPub, getPubById } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";
import { fetchPage } from "store/actions/Api";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => {
    const { publicationId, pageId: id, anchor } = getCurrentPub(state);
    const pub = getPubById(state, publicationId);
    return {
        id,
        publicationId,
        direction: localization.getDirection(pub.language || state.language),
        anchor
    };
};

const mapDispatchToState = {
    fetchPage
};

/**
 * Connector of Page component for Redux
 *
 * @export
 */
export const Page = connect(mapStateToProps, mapDispatchToState)(PagePresentation);
