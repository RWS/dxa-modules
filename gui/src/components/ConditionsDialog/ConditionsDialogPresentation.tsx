import * as React from "react";
import Dialog from "components/presentation/Dialog/Dialog";
import { IRequestHandler } from "../presentation/Dialog/Dialog";

export interface IConditionsDialogPresentationProps {
    open: boolean;

    requestOpen: IRequestHandler;
    requestClose: IRequestHandler;
}

const actions = (props: IConditionsDialogPresentationProps) => <div>
    <button className="sdl-button graphene sdl-button-purpose-confirm">Personalize</button>
    <button onClick={props.requestClose} className="sdl-button graphene sdl-button-purpose-general">Cancel</button>
</div>;

const title = (props: IConditionsDialogPresentationProps) => <div>
    <h3>Personalize Content</h3>
    <p>Brief description. Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
</div>;

export const ConditionsDialogPresentation = (props: IConditionsDialogPresentationProps) => (
    <div className="sdl-conditions-dialog-presentation">
        <button onClick={props.requestOpen}>Open</button>
        <Dialog actions={actions(props)}
            title={title(props)}
            open={props.open}
            onRequestClose={props.requestClose}>
            <p>text</p>
            <p>text</p>
            <p>text</p>
            <p>text</p>
        </Dialog>
    </div>
);