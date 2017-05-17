import * as React from "react";
import Dialog, { IRequestHandler } from "components/presentation/Dialog/Dialog";

import I18n from "components/helpers/I18n";
import ConditionsFetcher from "./ConditionsFetcher";

import "./ConditionsDialog.less";
import { IConditionMap } from "store/reducers/conditions/IConditions";

export interface IConditionsDialogPresentationProps {
    //unfortunatly we need pubId to pass to handlers
    pubId: string;
    isOpen: boolean;
    conditions: IConditionMap;
    open: IRequestHandler;
    close: IRequestHandler;
    apply: (pubId: string, conditions: IConditionMap) => void;
}

const submit = (props: IConditionsDialogPresentationProps) => {
    props.close();
    props.apply(props.pubId, props.conditions);
};

const getActions = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-actions">
    <button
        onClick={() => submit(props)}
        className="sdl-button graphene sdl-button-purpose-confirm">Personalize</button>
    <span className="sdl-button-separator"> </span>
    <button
        onClick={props.close}
        className="sdl-button graphene sdl-button-purpose-general">Cancel</button>
</div>;

const getTitle = (props: IConditionsDialogPresentationProps) => <div className="sdl-conditions-dialog-top-bar">
    <h3><I18n data="components.conditions.dialog.title" /></h3>
    <p><I18n data="components.conditions.dialog.description" /></p>
</div>;

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) => {
    return <div className="sdl-conditions-dialog-presentation">
        <ConditionsFetcher />
        <button
            className="sdl-button-text sdl-personalize-content"
            onClick={props.open}>
            <I18n data="components.conditions.dialog.title" />
        </button>
        <Dialog
            actions={getActions(props)}
            title={getTitle(props)}
            open={props.isOpen}
            onRequestClose={props.close}>
            <code>{JSON.stringify(props.conditions)}</code>
        </Dialog>
    </div>;
};