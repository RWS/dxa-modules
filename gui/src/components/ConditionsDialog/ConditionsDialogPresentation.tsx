import * as React from "react";
import { Dialog, IRequestHandler } from "components/presentation/Dialog/Dialog";
import ConditionsFetcher from "./ConditionsFetcher";
import { IConditionMap, ICondition } from "store/interfaces/Conditions";
import I18n from "components/helpers/I18n";
import { ConditionsLabelManager } from "components/ConditionsLabelManager/ConditionsLabelManager";
import { isEmpty } from "lodash";

import "./ConditionsDialog.less";
import { ILabelManagerItem } from "@sdl/controls";

export interface IConditionsDialogPresentationProps {
    //unfortunatly we need pubId to pass to handlers
    pubId: string;
    isOpen: boolean;
    conditions: IConditionMap;
    editingConditions: IConditionMap;
    open: IRequestHandler;
    close: IRequestHandler;
    apply: (pubId: string, conditions: IConditionMap) => void;
    change: (conditions: IConditionMap) => void;
}

interface IX {
    name: string;
    value: ICondition;
}

const submit = (props: IConditionsDialogPresentationProps) => {
    props.apply(props.pubId, props.editingConditions);
    props.close();
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

const getConditions = (props: IConditionsDialogPresentationProps) => (
    <ol className="sdl-conditions-dialog-list">
        {Object.keys(props.conditions)
            .map(key => ({
                name: key,
                value: props.conditions[key]
            }))
            .map(({ name, value: condition }: IX) => (
                <li key={name}>
                    <label className="sdl-conditions-dialog-condition-label">{name}</label>

                    { !condition.range && <ConditionsLabelManager
                        values={props.editingConditions[name] ? props.editingConditions[name].values : condition.values}
                        condition={condition}
                        onChange={(items: ILabelManagerItem[]) => {
                            props.change({
                                [name]: {
                                    ...condition,
                                    values: items.map(item => item.id)
                                }
                            });
                        }}
                    /> }

                    { condition.range && <input type="text"
                        value={props.editingConditions[name] &&
                            JSON.stringify(props.editingConditions[name].values) != JSON.stringify(condition.values)
                            ? props.editingConditions[name].values[0]
                            : ""}
                        onChange={(evt: React.KeyboardEvent) => {
                            let value = (evt.nativeEvent.target as HTMLInputElement).value;
                            props.change({
                                [name]: {
                                    ...condition,
                                    values: value === "" ? condition.values : [value]
                                }
                            });
                        }}
                    />}
                </li>
            ))
        }
    </ol>);

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) =>
    <div className="sdl-conditions-dialog-presentation">
        <ConditionsFetcher />
        <button
            className="sdl-button-text sdl-personalize-content"
            onClick={props.open}
            disabled={isEmpty(props.conditions)}>
            <I18n data="components.conditions.dialog.title" />
        </button>
        <Dialog
            actions={getActions(props)}
            title={getTitle(props)}
            open={props.isOpen}
            onRequestClose={props.close}>
            {getConditions(props)}
        </Dialog>
    </div>;
