import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles/Dropdown";

interface IPathEvent extends MouseEvent {
    path: HTMLElement[];
}

export interface IDropdownValue {
    text: string;
    value: string;
}

export enum DropdownToggleState {
    "OFF",
    "ON"
};

export interface IClick {
    (index: number): void;
}

export interface IDropdownProps {
    selected?: IDropdownValue;
    placeHolder?: string;
    items?: IDropdownValue[];
    onClickItem?: IClick;
}

export interface IDropdownState {
    status: DropdownToggleState;
    selected: IDropdownValue | null;
    items: IDropdownValue[];
}

export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {

    private _element: HTMLElement;

    constructor() {
        super();
        this.state = {
            items: [],
            selected: null,
            status: DropdownToggleState.OFF
        };

        this.toggleOff();
    }

    public isOpen(): boolean {
        return this.state.status == DropdownToggleState.ON;
    }

    public isClose(): boolean {
        return this.state.status == DropdownToggleState.OFF;
    }

    public toggleOn(e?: Event): void {
        if (!this.isOpen()) {
            this.setState({
                status: DropdownToggleState.ON
            } as IDropdownState);
        }
    }

    public toggleOff(e?: Event): void {
        if (!this.isClose()) {
            this.setState({
                status: DropdownToggleState.OFF
            } as IDropdownState);
        };
    }

    public toggle(e?: Event): void {
        if (this.isOpen()) {
            this.toggleOff(e);
        } else {
            this.toggleOn(e);
        }
    }

    public getValue(): string | null {
        return this.state.selected && this.state.selected.value;
    }

    public getText(): string | null {
        return this.state.selected && this.state.selected.text;
    }

    public componentWillMount(): void {
        const props = this.props;
        let selected: IDropdownValue | null = (props.selected) ? props.selected
            : (props.placeHolder) ? null
            : (props.items) ? props.items[0]
            : null;

        this.setState({
            items: props.items || [],
            selected
        } as IDropdownState);
    }

    public componentDidMount(): void {
        const domNode = ReactDOM.findDOMNode(this);
        this._element = domNode as HTMLElement;
        document.addEventListener("click", this.onFocusout.bind(this));
    }

    public componentWillUpdate(nextProps: IDropdownProps, nextState: IDropdownState): void {
    }

    public componentWillUnmount(): void {
    }

    public render(): JSX.Element {
        let items: JSX.Element[] = [];
        let options: JSX.Element[] = [];

        const dropdownClasses = ClassNames({
            "sdl-dita-delivery-dropdown": true,
            "open": this.state.status == DropdownToggleState.ON
        });

        this.state.items.map((item, index): void => {
            if (this.state.selected && item.value == this.state.selected.value) {
                items.push(
                    <li key={item.value} className="active">
                        <a href="#">
                            {item.text}
                            <span className="checked"/>
                        </a>
                    </li>);
            } else {
                items.push(<li key={item.value} onClick={this.onClickItem.bind(this, index)}><a href="#">{item.text}</a></li>);
            }
        });
        for (let item of this.state.items) {
            options.push(<option key={item.value} value={item.value}>{item.text}</option>);
        }

        return (
            <div className={dropdownClasses}>
                <button className="dropdown-toggle" type="button" data-toggle="dropdown" onClick={this.toggle.bind(this)}>
                    {this._getButtonText()}
                    <span className="caret">
                    </span>
                </button>
                <div className="dropdown-menu">
                    <div className="dropdown-arrow"></div>
                    <ul className="dropdown-items">
                        {items}
                    </ul>
                </div>
                <select value={this.state.selected && this.state.selected.value || undefined} onChange={this.onChangeSelect.bind(this)}>
                    {options}
                </select>
            </div>
        );
    }

    private _getButtonText(): string {
        let buttonText;
        if (this.state.selected) {
            buttonText = this.state.selected.text;
        } else if (this.props.placeHolder) {
            buttonText = this.props.placeHolder;
        } else {
            buttonText = "";
        }
        return buttonText;
    }

    private onFocusout(event: MouseEvent): void {
        if ((event as IPathEvent).path.indexOf(this._element) == -1) {
            this.toggleOff();
        }
    }

    private onClickItem(index: number): void {
        this.setState({
            selected: this.state.items[index]
        } as IDropdownState);
        this.toggleOff();
        return this.props.onClickItem && this.props.onClickItem(index);
    }

    private onChangeSelect(event: React.FormEvent): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        const items = this.state.items;
        const values = items.map((item: IDropdownValue) => item.value);
        return this.onClickItem(values.indexOf(selectedValue));
    }
}
