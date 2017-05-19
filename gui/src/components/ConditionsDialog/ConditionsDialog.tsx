import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogOpen, dialogClose, applyConditions, updateEditingConditions} from "store/actions/Actions";
import { getCurrentPub, isConditionsDialogVisible, getConditionsByPubId, getEditingConditions, getLastConditions } from "store/reducers/Reducer";
import { MD5 } from "object-hash";
const emptyObj = MD5({});

const mapStateToProps = (state: IState) => {
    const { publicationId: pubId } = getCurrentPub(state);
    const conditions = getConditionsByPubId(state, pubId);
    const editingConditions = getEditingConditions(state);
    const lastConditions = getLastConditions(state, pubId);
    return {
        pubId,
        isOpen: isConditionsDialogVisible(state),
        conditions,
        editingConditions: MD5(editingConditions) === emptyObj ? lastConditions : editingConditions
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
