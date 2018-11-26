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

    /**
     * If splitter is in left to right content
     * @type {}
     */
    isLtr: boolean;
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
    splitterOffset: number;
}

/**
 * Dropdown
 */
export class SplitterPresentation extends React.Component<ISplitterProps, ISplitterState> {
    private _isUnmounted: boolean = false;
    private _splitterElement: HTMLElement;

    /**
     * Creates an instance of Dropdown
     *
     */
    constructor(props: ISplitterProps) {
        super();
        this.state = {
            isDragging: false,
            splitterOffset: props.splitterPosition
        };

        this._dragStart = this._dragStart.bind(this);
        this._dragEnd = this._dragEnd.bind(this);
        this._dragMove = this._dragMove.bind(this);
        this._touchDragMove = this._touchDragMove.bind(this);

        this._onSplitterPositionChanged = throttle(this._onSplitterPositionChanged.bind(this), 50);
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
        window.addEventListener("touchmove", this._touchDragMove);

        // On drag End
        window.addEventListener("mouseup", this._dragEnd);
        window.addEventListener("touchend", this._dragEnd);

        this._splitterElement = handle;
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <span className={"sdl-dita-delivery-splitter"} />;
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
        window.removeEventListener("touchmove", this._touchDragMove);

        window.removeEventListener("mouseup", this._dragEnd);
        window.removeEventListener("touchend", this._dragEnd);
    }

    public componentDidUpdate(): void {
        if (!this._isUnmounted) {
            const { splitterOffset } = this.state;
            this._onSplitterPositionChanged(splitterOffset);
        }
    }

    private _dragStart(e: MouseEvent | TouchEvent): void {
        if (!this._isUnmounted) {
            e.preventDefault();
            this.setState({
                isDragging: true
            });
        }
    }

    private _dragEnd(e: MouseEvent | TouchEvent): void {
        const { isDragging } = this.state;
        if (!this._isUnmounted && isDragging) {
            e.preventDefault();
            this.setState({
                isDragging: false
            });
        }
    }

    private _dragMove(e: MouseEvent): void {
        const { isDragging } = this.state;
        if (!this._isUnmounted && isDragging) {
            e.preventDefault();
            this._setMoveOffset(e.clientX);
        }
    }

    // Weird FF issue
    private _touchDragMove(e: TouchEvent): void {
        const { isDragging } = this.state;
        if (!this._isUnmounted && isDragging) {
            e.preventDefault();
            this._setMoveOffset(e.touches[0].clientX);
        }
    }

    private _setMoveOffset(clientX: number): void {
        const splitterElement = this._splitterElement;
        const { isLtr } = this.props;
        const { left } = splitterElement.getBoundingClientRect();
        let offset = 0,
            prevSibling = splitterElement;
        while ((prevSibling = prevSibling.previousElementSibling as HTMLElement)) {
            offset += prevSibling.offsetWidth;
        }

        const splitterOffset = Math.floor(offset - (isLtr ? left - clientX : clientX - left));
        this.setState({
            splitterOffset
        });
    }

    private _onSplitterPositionChanged(newSplitterOffset: number): void {
        const { splitterPositionChange, splitterPosition } = this.props;
        if (typeof splitterPositionChange === "function" && newSplitterOffset !== splitterPosition) {
            splitterPositionChange(newSplitterOffset);
            let resizeEvent;
            if (typeof Event === "function") {
                resizeEvent = new Event("resize");
            } else {
                resizeEvent = document.createEvent("Event");
                resizeEvent.initEvent("resize", true, true);
            }
            window.dispatchEvent(resizeEvent);
        }
    }
}
