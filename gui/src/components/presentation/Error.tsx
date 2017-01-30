import * as React from "react";
import "components/presentation/styles/Error";
import "dist/dita-ot/styles/commonltr";
import "dist/dita-ot/styles/commonrtl";

export interface IErrorProps {
    title: string;
    messages: string[];
    buttons: JSX.Element;
}

export const Error = (props: IErrorProps) => {
    const messages = props.messages.map((value, index) => <p key={index}>{value}</p>);

    return (
        <div className="sdl-dita-delivery-error">
            <h1>{props.title}</h1>
            <div>{messages}</div>
            <div className="sdl-dita-delivery-button-group">
                {props.buttons}
            </div>
        </div>
    );
};