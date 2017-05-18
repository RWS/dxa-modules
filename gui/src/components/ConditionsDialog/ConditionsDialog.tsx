import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogOpen, dialogClose, applyConditions } from "store/actions/Actions";
import { getCurrentPub, isConditionsDialogVisible, getConditionsByPubId } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentPub(state);
    const conditions = getConditionsByPubId(state, pubId);
    return {
        pubId,
        isOpen: isConditionsDialogVisible(state),
        conditions
    };
};

const mapDispatchToState = {
    open: dialogOpen,
    close: dialogClose,
    apply: applyConditions
};

export const ConditionsDialog = connect(
    mapStateToProps,
    mapDispatchToState
)(ConditionsDialogPresentation);
