/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import { isEmpty, isEqual } from "lodash";
import { ILabelManagerItem } from "@sdl/controls";
import I18n from "@sdl/dd/helpers/I18n";
import { ConditionsLabelManager } from "@sdl/dd/ConditionsLabelManager/ConditionsLabelManager";
import { Dialog, IRequestHandler } from "@sdl/dd/presentation/Dialog/Dialog";
import { IConditionMap, ICondition } from "store/interfaces/Conditions";
import ConditionsFetcher from "@sdl/dd/ConditionsDialog/ConditionsFetcher";
import { DatePicker } from "@sdl/dd/DatePicker/DatePicker";

import "./ConditionsDialog.less";
import "components/Input/Input.less";

export interface IInputCondition {
    [name: string]: string;
}

export interface IConditionsDialogPresentationState {
    inputCondition: IInputCondition;
}

export interface IConditionsDialogPresentationProps {
    // unfortunatly we need pubId to pass to handlers
    pubId: string;
    isOpen: boolean;
    allConditions: IConditionMap;
    editingConditions: IConditionMap;
    open: IRequestHandler;
    close: IRequestHandler;
    apply: (pubId: string, conditions: IConditionMap) => void;
    change: (conditions: IConditionMap) => void;
}

export class ConditionsDialogPresentation extends React.Component<
    IConditionsDialogPresentationProps,
    IConditionsDialogPresentationState
> {
    constructor() {
        super();
        this.state = {
            inputCondition: {}
        };
    }

    public render(): JSX.Element {
        const { isOpen, open, close, allConditions } = this.props;
        return (
            <div className="sdl-conditions-dialog-presentation">
                <ConditionsFetcher />
                <button
                    className="sdl-button-text sdl-personalize-content"
                    onClick={open}
                    disabled={isEmpty(allConditions)}>
                    <I18n data="components.conditions.dialog.title" />
                </button>
                <Dialog actions={this._getActions()} title={this._getTitle()} open={isOpen} onRequestClose={close}>
                    {this._getConditions(allConditions)}
                </Dialog>
            </div>
        );
    }

    private _submit(): void {
        const { apply, close, pubId, editingConditions } = this.props;
        apply(pubId, editingConditions);
        close();
    }

    private _changeWrapper(
        name: string,
        condition: ICondition,
        change: (conditions: IConditionMap) => void
    ): (values: string[]) => void {
        return values => {
            change({
                [name]: {
                    ...condition,
                    values
                }
            });
        };
    }

    private _getActions(): JSX.Element {
        const { close } = this.props;
        return (
            <div className="sdl-conditions-dialog-actions">
                <button onClick={() => this._submit()} className="sdl-button graphene sdl-button-purpose-confirm">
                    <I18n data="components.conditions.dialog.personalize" />
                </button>
                <span className="sdl-button-separator"> </span>
                <button onClick={close} className="sdl-button graphene sdl-button-purpose-general">
                    <I18n data="components.conditions.dialog.cancel" />
                </button>
            </div>
        );
    }

    private _getTitle(): JSX.Element {
        return (
            <div className="sdl-conditions-dialog-top-bar">
                <h3>
                    <I18n data="components.conditions.dialog.title" />
                </h3>
                <p>
                    <I18n data="components.conditions.dialog.description" />
                </p>
            </div>
        );
    }

    private _getConditionsLabelManager(condition: ICondition, name: string): JSX.Element {
        const { change, editingConditions } = this.props;
        const changeWrapper = this._changeWrapper(name, condition, change);
        return (
            <ConditionsLabelManager
                values={editingConditions[name] ? editingConditions[name].values : condition.values}
                condition={condition}
                onChange={(items: ILabelManagerItem[]) => changeWrapper(items.map(item => item.id))}
            />
        );
    }

    private _getInput(condition: ICondition, name: string): JSX.Element {
        const { change } = this.props;
        const { inputCondition } = this.state;
        const changeWrapper = this._changeWrapper(name, condition, change);
        return (
            <input
                className="sdl-input-text small"
                type="text"
                value={inputCondition[name] || ""}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    let value = evt.currentTarget.value as string;
                    changeWrapper([value]);
                    this.setState({ inputCondition: { ...inputCondition, [name]: value } });
                }}
            />
        );
    }

    private _getDatePicker(condition: ICondition, name: string): JSX.Element {
        const { change, editingConditions } = this.props;
        const changeWrapper = this._changeWrapper(name, condition, change);
        return (
            <DatePicker
                value={
                    editingConditions[name] && !isEqual(editingConditions[name].values, condition.values)
                        ? editingConditions[name].values[0]
                        : ""
                }
                onChangeHandler={value => {
                    changeWrapper(!value ? condition.values : [value.format("YYYYMMDD")]);
                    return undefined;
                }}
            />
        );
    }

    private _getConditions(allConditions: IConditionMap): JSX.Element {
        return (
            <ol className="sdl-conditions-dialog-list">
                {Object.keys(allConditions).map(name => {
                    const condition = allConditions[name];
                    const { range, datatype } = condition;
                    return (
                        <li key={name}>
                            <label className="sdl-conditions-dialog-condition-label">{name}</label>
                            {!range
                                ? // If range is false then simple field
                                  this._getConditionsLabelManager(condition, name)
                                : // Otherwise check if date field is defined
                                  datatype === "Date"
                                  ? // If so, then date field
                                    this._getDatePicker(condition, name)
                                  : // Otherwise simple input field
                                    this._getInput(condition, name)}
                        </li>
                    );
                })}
            </ol>
        );
    }
}
