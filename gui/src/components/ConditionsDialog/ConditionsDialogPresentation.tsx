import * as React from "react";
import Dialog, { IRequestHandler } from "components/presentation/Dialog/Dialog";
import I18n from "components/helpers/I18n";
import "./ConditionsDialog.less";

export interface IConditionsDialogPresentationProps {
    open: boolean;

    requestOpen: IRequestHandler;
    requestClose: IRequestHandler;
}

const actions = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-actions">
    <button className="sdl-button graphene sdl-button-purpose-confirm">Personalize</button>
    <span className="sdl-button-separator"> </span>
    <button
        onClick={props.requestClose}
        className="sdl-button graphene sdl-button-purpose-general">Cancel</button>
</div>;

const title = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-top-bar">
    <h3><I18n data="components.conditions.dialog.title" /></h3>
    <p><I18n data="components.conditions.dialog.description" /></p>
</div>;

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) => (
    <div className="sdl-conditions-dialog-presentation">
        <button
            className="sdl-button-text sdl-personalize-content"
            onClick={props.requestOpen}>
            <I18n data="components.conditions.dialog.title" />
        </button>
        <Dialog
            actions={actions(props)}
            title={title(props)}
            open={props.open}
            onRequestClose={props.requestClose}>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
        </Dialog>
    </div>
);