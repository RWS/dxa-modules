import { connect } from "react-redux";
import { PagePresentation, IPageProps } from "./PagePresentation";
import { IState } from "store/interfaces/State";
import { getCurrentPub, getPubById } from "store/reducers/Reducer";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState, ownProps: IPageProps): {} => {
    const { publicationId, anchor } = getCurrentPub(state);
    const pub = getPubById(state, publicationId);
    return {
        direction: localization.getDirection(pub.language || state.language),
        anchor: anchor
    };
};

/**
 * Connector of Page component for Redux
 *
 * @export
 */
export const Page = connect(mapStateToProps)(PagePresentation);
