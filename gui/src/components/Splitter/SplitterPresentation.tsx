import * as React from "react";
import * as ReactDOM from "react-dom";
import { throttle } from "lodash";

import "./Splitter.less";

/**
 * Splitter interface
 *
 * @export
 * @interface ISplitterProps
 */
export interface ISplitterProps {
    /**
     * Splitter initial Position
     *
     * @type {number}
     */
    splitterPosition: number;

    /**
     * If splitter is dragging
     * @type {}
     */
    splitterPositionChange?: (splitterPositionX: number) => void;
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

    /**
     * Splitter width
     * @type {number}
     */
    width: number;
}

/**
 * Dropdown
 */
export class SplitterPresentation extends React.Component<
    ISplitterProps,
    ISplitterState
> {
    private _isUnmounted: boolean = false;
    private _splitterElement: HTMLElement;

    /**
     * Creates an instance of Dropdown
     *
     */
    constructor() {
        super();
        this.state = {
            isDragging: false,
            width: 0
        };

        this._dragStart = this._dragStart.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
        this._dragMove = this._dragMove.bind(this);
        this._windowResize = this._windowResize.bind(this);

        this._onSplitterPositionChanged = throttle(
            this._onSplitterPositionChanged.bind(this),
            50
        );
    }

    /**
     * Component did mount
     */
    public componentDidMount(): void {
        const domNode = ReactDOM.findDOMNode(this);
        const handle = domNode as HTMLElement;

        // On drag Start
        handle.addEventListener("mousedown", this._dragStart);
        handle.addEventListener("touchstart", this._dragStart);

        // On drag
        window.addEventListener("mousemove", this._dragMove);
        window.addEventListener("touchmove", this._dragMove);

        // On drag End
        window.addEventListener("mouseup", this._dragEnd);
        window.addEventListener("touchend", this._dragEnd);

        // On window resize
        window.addEventListener("resize", this._windowResize);

        this._splitterElement = handle;
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { width } = this.state;
        return (
            <span
                style={width ? { width } : {}}
                className={"sdl-dita-delivery-splitter separator"}
            />
        );
    }

    /**
     * Remove listeners when component about to be unmounted
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;

        const handle = this._splitterElement;
        handle.removeEventListener("mousedown", this._dragStart);
        handle.removeEventListener("touchstart", this._dragStart);

        window.removeEventListener("mousemove", this._dragMove);
        window.removeEventListener("touchmove", this._dragMove);

        window.removeEventListener("mouseup", this._dragEnd);
        window.removeEventListener("touchend", this._dragEnd);

        window.removeEventListener("resize", this._windowResize);
    }

    public componentDidUpdate(): void {
        if (!this._isUnmounted) {
            const { width } = this._splitterElement.getBoundingClientRect();
            this._onSplitterPositionChanged(width);
        }
    }

    private _dragStart(e: MouseEvent | TouchEvent ): void {
        if (!this._isUnmounted) {
            e.preventDefault();
            this.setState({
                isDragging: true
            });
        }
    }

    private _dragEnd(e: MouseEvent | TouchEvent ): void {
        if (!this._isUnmounted) {
            e.preventDefault();
            this.setState({
                isDragging: false
            });
        }
    }

    private _dragMove(e: MouseEvent | TouchEvent): void {
        e.preventDefault();
        const { isDragging } = this.state;
        if (!this._isUnmounted && isDragging) {
            const { left } = this._splitterElement.getBoundingClientRect();
            const width = this._getClientX(e) - left + 3;
            this.setState({
                width
            });
        }
    }

    private _getClientX(e: MouseEvent | TouchEvent): number {
        if (e instanceof TouchEvent) {
            return e.touches[0].clientX;
        }
        return e.clientX;
    }

    private _windowResize(): void {
        if (!this._isUnmounted) {
            const handle = this._splitterElement;
            if (handle && handle.offsetParent === null) {
                this.setState({
                    isDragging: false,
                    width: 0
                });
            }
        }
    }

    private _onSplitterPositionChanged(newSplitterPosition: number): void {
        const { splitterPositionChange, splitterPosition } = this.props;
        if (typeof splitterPositionChange === "function" && (newSplitterPosition !== splitterPosition)) {
            splitterPositionChange(newSplitterPosition);
            window.dispatchEvent(new Event("resize"));
        }
    }
}
