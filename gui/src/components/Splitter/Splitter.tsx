//import * as ClassNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./Splitter.less";

/**
 * Splitter interface
 *
 * @export
 * @interface ISplitterProps
 */
export interface ISplitterProps {
    /**
     * Executed function of draggable item
     *
     * @type {onMove}
     */
    onMove?: (delta: number) => void;
}

/**
 * Splitter state
 *
 * @export
 * @interface
 */
export interface ISplitterState {
    /**
     * If splitter is dragging
     * @type {ISplitterState}
     */
    isDragging: boolean;
}

/**
 * Dropdown
 */
export class Splitter extends React.Component<ISplitterProps, ISplitterState> {

    private _isUnmounted: boolean = false;
    private _splitterElement: HTMLElement;

    /**
     * Creates an instance of Dropdown
     *
     */
    constructor() {
        super();
        this.state = {
            isDragging: false
        };

        this._dragStart = this._dragStart.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
        this._dragMove = this._dragMove.bind(this);
    }

    /**
     * Component did mount
     */
    public componentDidMount(): void {
        const domNode = ReactDOM.findDOMNode(this);
        this._splitterElement = domNode as HTMLElement;
        const splitter = this._splitterElement;

        // On drag Start
        splitter.addEventListener("mousedown", this._dragStart);
        splitter.addEventListener("touchstart", this._dragStart);

        // On drag
        window.addEventListener("mousemove", this._dragMove);
        window.addEventListener("touchmove", this._dragMove);

        // On drag End
        window.addEventListener("mouseup",  this._dragEnd);
        window.addEventListener("touchend", this._dragEnd);
    }

    /**
     * Remove listeners when component about to be unmounted
     */
    public componentWillUnmount(): void {

        this._isUnmounted = true;

        const domNode = ReactDOM.findDOMNode(this);
        this._splitterElement = domNode as HTMLElement;
        const splitter = this._splitterElement;

        splitter.removeEventListener("mousedown", this._dragStart);
        splitter.removeEventListener("touchstart", this._dragStart);

        window.removeEventListener("mousemove", this._dragMove);
        window.removeEventListener("touchmove", this._dragMove);
        window.removeEventListener("mouseup",  this._dragEnd);
        window.removeEventListener("touchend", this._dragEnd);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className={"sdl-dita-delivery-splitter"} />;
    }

    private _dragStart(e: MouseEvent /*| TouchEvent*/): void {
        e.preventDefault();

        if (!this._isUnmounted) {
            this.setState({
                isDragging: true
            });
        }
    }

    private _dragEnd(e: MouseEvent /*| TouchEvent*/): void {
        e.preventDefault();

        if (!this._isUnmounted) {
            this.setState({
                isDragging: false
            });
        }
    }

    private _dragMove(e: MouseEvent /*| TouchEvent*/): void {
        e.preventDefault();

        if (!this._isUnmounted) {
            const { isDragging } = this.state;
            const { onMove } = this.props;
            if (isDragging && (typeof onMove === "function")) {
                onMove(e.clientX);
                //console.log(e.clientX);
            }
        }
    }
}
