import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./styles/Dropdown";

/**
 * Event extension for TypeScript to get event's path property
 */
interface IPathEvent extends MouseEvent {
    path: HTMLElement[];
}

/**
 * Dropdown value item 
 * 
 * @export
 * @interface IDropdownValue
 */
export interface IDropdownValue {
    /**
     * Text of dropdown item
     * 
     * @type {string}
     */
    text: string;
    /**
     * Value of dropdown item
     * 
     * @type {string}
     */
    value: string;
}

/**
 * Toggle states to hide \ show dropdown
 *
 * @export
 */
export enum DropdownToggleState {
    "OFF",
    "ON"
};

/**
 * Interface for onChange event function
 * 
 * @export
 * @interface IOnChangeEvent
 */
export interface IOnChangeEvent {
    /**
     * Function interface 
     * 
     * @returns {void} 
     */
    (index: number): void;
}

/**
 * Dropdown interface
 *
 * @export
 * @interface IDrodownProps
 */
export interface IDropdownProps {
    /**
     * Initial selected item of dropdown
     * 
     * @type {IDropdownValue}
     */
    selected?: IDropdownValue;
    /**
     * Placeholder for dropdown text when no element is selected
     * 
     * @type {string}
     */
    placeHolder?: string;
    /**
     * List of dropdown items
     * 
     * @type {IDropdownValue[]}
     */
    items: IDropdownValue[];
    /**
     * Executed function of selected item
     * 
     * @type {IClick}
     */
    onChange?: IOnChangeEvent;
}

/**
 * Dropdown state
 *
 * @export
 * @interface
 */
export interface IDropdownState {
    /**
     * Current status of dropdown component (shown \ hidden)
     * 
     * @type {DropdownToggleState}
     */
    status: DropdownToggleState;
    /**
     * Current selected item
     * @type {IDropdownValue | null}
     */
    selected: IDropdownValue | null;
}

/**
 * Dropdown
 */
export class Dropdown extends React.Component<IDropdownProps, IDropdownState> {

    private _element: HTMLElement;

    /**
     * Creates an instance of Dropdown
     * 
     */
    constructor() {
        super();
        this.state = {
            selected: null,
            status: DropdownToggleState.OFF
        };

        this.toggleOff();
    }

    /**
     * Check if dropdown is opened
     *
     * @returns {boolean} true if dropdown is openen, otherwise false
     */
    public isOpen(): boolean {
        return this.state.status == DropdownToggleState.ON;
    }

    /**
     * Check if dropdown is closed
     *
     * @returns {boolean} true if dropdown is closed, otherwise false
     */
    public isClose(): boolean {
        return this.state.status == DropdownToggleState.OFF;
    }

    /**
     * Open dropdown
     *
     * @returns {void}
     */
    public toggleOn(): void {
        if (!this.isOpen()) {
            this.setState({
                status: DropdownToggleState.ON
            } as IDropdownState);
        }
    }

    /**
     * Close dropdown
     *
     * @returns {void}
     */
    public toggleOff(): void {
        if (!this.isClose()) {
            this.setState({
                status: DropdownToggleState.OFF
            } as IDropdownState);
        };
    }

    /**
     * Switch dropdown state
     *
     * @returns {void}
     */
    public toggle(): void {
        if (this.isOpen()) {
            this.toggleOff();
        } else {
            this.toggleOn();
        }
    }

    /**
     * Return current value of selected item
     *
     * @returns {string | null}
     */
    public getValue(): string | null {
        return this.state.selected && this.state.selected.value;
    }

    /**
     * Return current text of selected item
     *
     * @returns {string | null}
     */
    public getText(): string | null {
        return this.state.selected && this.state.selected.text;
    }

    /**
     * Component will mount 
     */
    public componentWillMount(): void {
        const props = this.props;
        let selected: IDropdownValue | null = (props.selected) ? props.selected
            : (props.placeHolder) ? null
            : props.items[0];

        this.setState({
            selected
        } as IDropdownState);
    }

    /**
     * Component did mount
     */
    public componentDidMount(): void {
        const domNode = ReactDOM.findDOMNode(this);
        this._element = domNode as HTMLElement;
        document.addEventListener("click", this.onFocusout.bind(this));
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        let items: JSX.Element[] = [];
        let options: JSX.Element[] = [];

        const dropdownClasses = ClassNames({
            "sdl-dita-delivery-dropdown": true,
            "open": this.state.status == DropdownToggleState.ON
        });

        this.props.items.map((item, index): void => {
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
        options = this.props.items.map(item => <option key={item.value} value={item.value}>{item.text}</option>);

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
        const eventPath = event as IPathEvent;
        if (eventPath && eventPath.path && eventPath.path.indexOf(this._element) == -1) {
            this.toggleOff();
        }
    }

    private onClickItem(index: number): void {
        this.setState({
            selected: this.props.items[index]
        } as IDropdownState);
        this.toggleOff();
        return this.props.onChange && this.props.onChange(index);
    }

    private onChangeSelect(event: React.FormEvent): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        const items = this.props.items;
        const values = items.map((item: IDropdownValue) => item.value);
        return this.onClickItem(values.indexOf(selectedValue));
    }
}
