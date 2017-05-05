import { IState } from "store/interfaces/State";
import { connect } from "react-redux";
import { ConditionsDialogPresentation } from "./ConditionsDialogPresentation";
import { dialogRequestOpen, dialogRequestClose } from "store/actions/Actions";

const mapStateToProps = ({ conditions }: IState) => ({
    open: conditions.showDialog
});

const mapDispatchToState = {
    requestOpen: dialogRequestOpen,
    requestClose: dialogRequestClose
};
export const ConditionsDialog = connect(
    mapStateToProps,
    mapDispatchToState
)(ConditionsDialogPresentation);
