import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogOpen, dialogClose, applyConditions, updateEditingConditions } from "store/actions/Actions";
import { getCurrentPub, isConditionsDialogVisible, getAllConditionsByPubId, getEditingConditions, getLastConditions } from "store/reducers/Reducer";

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentPub(state);
    const editingConditions = getEditingConditions(state);
    return {
        pubId,
        isOpen: isConditionsDialogVisible(state),
        allConditions: getAllConditionsByPubId(state, pubId),
        editingConditions: !isEmpty(editingConditions) ? editingConditions : getLastConditions(state, pubId)
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
