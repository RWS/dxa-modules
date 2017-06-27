import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogOpen, dialogClose, applyConditions, updateEditingConditions } from "store/actions/Actions";
import { getCurrentPub, isConditionsDialogVisible, getAllConditionsByPubId, getEditingConditions, getLastConditions } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentPub(state);
    const conditions = Object.assign({}, getAllConditionsByPubId(state, pubId), getLastConditions(state, pubId));
    return {
        pubId,
        isOpen: isConditionsDialogVisible(state),
        conditions,
        editingConditions: getEditingConditions(state)
    };
};

const mapDispatchToState = {
    open: dialogOpen,
    close: dialogClose,
    apply: applyConditions,
    change: updateEditingConditions
};

export const ConditionsDialog = connect(
    mapStateToProps,
    mapDispatchToState
)(ConditionsDialogPresentation);
