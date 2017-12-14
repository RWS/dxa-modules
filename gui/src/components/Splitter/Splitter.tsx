import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { splitterPositionChange } from "store/actions/Actions";
import { SplitterPresentation } from "@sdl/dd/Splitter/SplitterPresentation";
import { localization } from "services/common/LocalizationService";

const mapStateToProps = (state: IState) => ({
        splitterPosition: state.splitterPosition,
        isLtr: localization.getDirection(state.language) !== "rtl"
});

const dispatchToProps = {
    splitterPositionChange
};

/**
 * Connector of Publication List component for Redux
 *
 * @export
 */
export const Splitter = connect(mapStateToProps, dispatchToProps)(SplitterPresentation);
