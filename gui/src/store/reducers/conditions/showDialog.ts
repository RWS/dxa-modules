import { combine, handleAction } from "../CombineReducers";
import { DIALOG_REQUEST_OPEN, DIALOG_REQUEST_CLOSE } from "store/actions/Actions";

const showDialog = combine(
    handleAction(DIALOG_REQUEST_OPEN, (state: boolean) => true, false),
    handleAction(DIALOG_REQUEST_CLOSE, (state: boolean) => false, false)
);

export const isVisible = (state: boolean) => state;

export default showDialog;