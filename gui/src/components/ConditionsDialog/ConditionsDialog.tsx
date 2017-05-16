import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogRequestOpen, dialogRequestClose } from "store/actions/Actions";
import { getCurrentPub, isConditionsDialogVisible, getConditionsByPubId } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentPub(state);
    const conditions = getConditionsByPubId(state, pubId);
    return {
        open: isConditionsDialogVisible(state),
        conditions
    };
};

const mapDispatchToState = {
    requestOpen: dialogRequestOpen,
    requestClose: dialogRequestClose
};

export const ConditionsDialog = connect(
    mapStateToProps,
    mapDispatchToState
)(ConditionsDialogPresentation);
