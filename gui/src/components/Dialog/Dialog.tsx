import * as React from "react";
import "./Dialog.less";
import * as ClassNames from "classnames";

const TITLE_CLASS = "sdl-dialog-title";
const BODY_CLASS = "sdl-dialog-body";
const ACTIONS_CLASS = "sdl-dialog-actions";
const CONTAINER_CLASS = "sdl-dialog-container";
const DIALOG_CLASS = "sdl-dialog";
const TOOLBAR_CLASS = "sdl-dialog-toolbar";

export type Elm = JSX.Element | string;

export interface IDialogProps {
    title?: JSX.Element;
    actions?: JSX.Element;
    children?: JSX.Element;
};

const renderTitle = (title: JSX.Element = (<h3>Dialog</h3>)): JSX.Element => (
    <div className={ClassNames([TITLE_CLASS, TOOLBAR_CLASS])} >
        {title}
    </div >
);

const renderBody = (body: JSX.Element = <p>Need body here</p>) => (
    <div className={BODY_CLASS}>
        b{body}
    </div>
);
const renderActions = (actions?: JSX.Element) => actions && (
    <div className={ClassNames([ACTIONS_CLASS, TOOLBAR_CLASS])}>
        {actions}
    </div>
);

class Dialog extends React.Component<IDialogProps, {}> {
    public render(): JSX.Element {
        const { children, title, actions } = this.props;

        return <div className={CONTAINER_CLASS}>
            <div className={DIALOG_CLASS}>
                {renderTitle(title)}
                {renderBody(children)}
                {renderActions(actions)}
            </div>
        </div>;
    }
}

export default Dialog;