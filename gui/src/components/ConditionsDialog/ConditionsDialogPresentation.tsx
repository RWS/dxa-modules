import * as React from "react";
import { Dialog, IRequestHandler } from "components/presentation/Dialog/Dialog";
import ConditionsFetcher from "./ConditionsFetcher";
import { IConditionMap, ICondition } from "store/reducers/conditions/IConditions";
import I18n from "components/helpers/I18n";
import { ConditionsLabelManager } from "./ConditionsLabelManager";

import "./ConditionsDialog.less";

export interface IConditionsDialogPresentationProps {
    //unfortunatly we need pubId to pass to handlers
    pubId: string;
    isOpen: boolean;
    conditions: IConditionMap;
    open: IRequestHandler;
    close: IRequestHandler;
    apply: (pubId: string, conditions: IConditionMap) => void;
}

interface IX {
    name: string;
    value: ICondition;
}

const submit = (props: IConditionsDialogPresentationProps) => {
    props.close();
    props.apply(props.pubId, props.conditions);
};

const getActions = (props: IConditionsDialogPresentationProps) =>
    <div className="sdl-conditions-dialog-actions">
        <button
            onClick={() => submit(props)}
            className="sdl-button graphene sdl-button-purpose-confirm">Personalize
        </button>
        <span className="sdl-button-separator"> </span>
        <button
            onClick={props.close}
            className="sdl-button graphene sdl-button-purpose-general">Cancel
        </button>
    </div>;

const getTitle = (props: IConditionsDialogPresentationProps) =>
    <div className="sdl-conditions-dialog-top-bar">
        <h3><I18n data="components.conditions.dialog.title" /></h3>
        <p><I18n data="components.conditions.dialog.description" /></p>
    </div>;

const EventHandler = (object: {}[]): void => {
    console.log("Change", object);
};

const getConditions = (conditions: IConditionMap) => (<ol>
    {Object.keys(conditions)
        .map(key => ({
            name: key,
            value: conditions[key]
        }))
        .map(({name, value: condition}: IX) => (
            <li>
                <h3>{name}</h3>
                <ConditionsLabelManager
                    condition={condition}
                    onChange={EventHandler}
                />
            </li>
        ))
    }
</ol>);

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) =>
    <div className="sdl-conditions-dialog-presentation">
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
                {getConditions(props.conditions)}
        </Dialog>
    </div>;