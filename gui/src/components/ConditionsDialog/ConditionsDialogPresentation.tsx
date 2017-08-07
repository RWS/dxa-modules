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

interface IConditionSimpleMap {
    name: string;
    value: ICondition;
}

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

export class ConditionsDialogPresentation extends React.Component<IConditionsDialogPresentationProps, IConditionsDialogPresentationState> {

    constructor() {
        super();
        this.state = {
            inputCondition : { }
        };
    }

    public render(): JSX.Element {
        const props = this.props;
        return (
            <div className="sdl-conditions-dialog-presentation">
                <ConditionsFetcher />
                <button
                    className="sdl-button-text sdl-personalize-content"
                    onClick={props.open}
                    disabled={isEmpty(props.allConditions)}>
                    <I18n data="components.conditions.dialog.title" />
                </button>
                <Dialog
                    actions={this.getActions()}
                    title={this.getTitle()}
                    open={props.isOpen}
                    onRequestClose={props.close}>
                    {this.getConditions()}
                </Dialog>
            </div>
        );
    }

    private submit = () => {
        const props = this.props;
        props.apply(props.pubId, props.editingConditions);
        props.close();
    }

    private changeWrapper = (name: string, condition: ICondition, change: (conditions: IConditionMap) => void) => (values: string[]) =>
        change({
            [name]: {
                ...condition,
                values
            }
        })

    private getActions = () => {
        return (<div className="sdl-conditions-dialog-actions">
            <button
                onClick={() => this.submit()}
                className="sdl-button graphene sdl-button-purpose-confirm">
                <I18n data="components.conditions.dialog.personalize" />
            </button>
            <span className="sdl-button-separator"> </span>
            <button
                onClick={this.props.close}
                className="sdl-button graphene sdl-button-purpose-general">
                <I18n data="components.conditions.dialog.cancel" />
            </button>
        </div>);
    }

    private getTitle = () => {
        return (<div className="sdl-conditions-dialog-top-bar">
            <h3><I18n data="components.conditions.dialog.title" /></h3>
            <p><I18n data="components.conditions.dialog.description" /></p>
        </div>);
    }

    private getConditionsLabelManager = (condition: ICondition, name: string) => {
        const props = this.props;
        const change = this.changeWrapper(name, condition, props.change);
        return (
            <ConditionsLabelManager
                values={props.editingConditions[name] ? props.editingConditions[name].values : condition.values}
                condition={condition}
                onChange={(items: ILabelManagerItem[]) => change(items.map(item => item.id))}
            />
        );
    }

    private getInput = (condition: ICondition, name: string) => {
        const props = this.props;
        const change = this.changeWrapper(name, condition, props.change);
        return (
            <input className="sdl-input-text small" type="text"
                value={this.state.inputCondition[name] ? this.state.inputCondition[name] : ""}
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                    let value = evt.currentTarget.value as string;
                    change(value === "" ? [""] : [value]);
                    this.setState({ ...this.state, inputCondition: {[name]: value }});
                }}
            />
        );
    }

    private getDatePicker = (condition: ICondition, name: string) => {
        const props = this.props;
        const change = this.changeWrapper(name, condition, props.change);
        return (
            <DatePicker
                value={props.editingConditions[name] &&
                    !isEqual(props.editingConditions[name].values, condition.values)
                    ? props.editingConditions[name].values[0]
                    : ""}
                onChangeHandler={(value) => {
                    change(!value ? condition.values : [value.format("YYYYMMDD")]);
                    return undefined;
                }}
            />
        );
    }

    private getConditions = () => {
        const props = this.props;
        return (<ol className="sdl-conditions-dialog-list">
            {Object.keys(props.allConditions)
                .map(key => ({
                    name: key,
                    value: props.allConditions[key]
                }))
                .map(({ name, value: condition }: IConditionSimpleMap) => {
                    return (
                        <li key={name}>
                            <label className="sdl-conditions-dialog-condition-label">{name}</label>
                            { !condition.range &&  this.getConditionsLabelManager(condition, name)}
                            { condition.range && condition.datatype === "Date" && this.getDatePicker(condition, name)}
                            { condition.range && condition.datatype !== "Date" && this.getInput(condition, name)}
                        </li>
                    );
                })
            }
        </ol>);
    }
}