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
import * as ClassNames from "classnames";
import EventListener from "react-event-listener";
import { KeyCodes } from "utils/Keys";

import "./Dialog.less";

const TITLE_CLASS = "sdl-dialog-title";
const BODY_CLASS = "sdl-dialog-body";
const ACTIONS_CLASS = "sdl-dialog-actions";
const CONTAINER_CLASS = "sdl-dialog-container";
const DIALOG_CLASS = "sdl-dialog";
const TOOLBAR_CLASS = "sdl-dialog-toolbar";
const CLOSE_BTN_CLASS = "sdl-dialog-close-btn";
const DIALOG_WRAPPER_CLASS = "sdl-dialog-wrapper";

export type Elm = JSX.Element | string;
export interface IRequestHandler {
    (): void;
}

export interface IDialogProps {
    title?: JSX.Element;
    actions?: JSX.Element;
    children?: JSX.Element;
    open?: boolean;
    onRequestClose?: IRequestHandler;
};

const renderTitle = (title: JSX.Element = <h3>Dialog</h3>, onRequestClose?: IRequestHandler): JSX.Element => (
    <div className={ClassNames([TITLE_CLASS, TOOLBAR_CLASS])}>
        {title}
        {onRequestClose &&
            <button
                className={ClassNames([CLOSE_BTN_CLASS, "sdl-button-text"])}
                onClick={onRequestClose}>&#9587;
            </button>}
    </div>
);

const renderBody = (body: JSX.Element = <p>Need body here</p>) => (
    <div className={BODY_CLASS}>
        {body}
    </div>
);

const renderActions = (actions?: JSX.Element) => actions && (
    <div className={ClassNames([ACTIONS_CLASS, TOOLBAR_CLASS])}>
        {actions}
    </div>
);

const handleKeyUp = (onRequestClose: IRequestHandler) => (e: KeyboardEvent) => {
    if (e.keyCode === KeyCodes.ESC) {
        onRequestClose();
    }
};

const escHandler = (onRequestClose: IRequestHandler) =>
    <EventListener
        target="window"
        onKeyUp={handleKeyUp(onRequestClose)}
    />;

const handleOutsideClick = (onRequestClose: IRequestHandler) => (event: React.MouseEvent<HTMLElement>) => {
    // Check that clicked outside of dialog
    if (onRequestClose && event.target === event.currentTarget) {
        onRequestClose();
    }
};

export class Dialog extends React.Component<IDialogProps, {}> {
    public render(): JSX.Element {
        const {
            children,
            title,
            actions,
            onRequestClose = () => {},
            open = false
        } = this.props;

        const className = ClassNames(CONTAINER_CLASS, { "sdl-dialog-open": open });

        return <div onClick={handleOutsideClick(onRequestClose)} className={className} >
            <div className={DIALOG_WRAPPER_CLASS}>
                {open && escHandler(onRequestClose)}
                {open && <div className={DIALOG_CLASS}>
                    {renderTitle(title, onRequestClose)}
                    {renderBody(children)}
                    {renderActions(actions)}
                </div>}
            </div>
        </div>;
    }
}

export default Dialog;
