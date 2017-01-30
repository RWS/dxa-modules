import * as React from "react";
import "components/presentation/styles/Error";

/**
 * Error component props
 *
 * @export 
 * @interface IErrorProps
 */
export interface IErrorProps {
    /**
     * Error title 
     * 
     * @type {string}
     * @memberOf IErrorProps
     */
    title: string;
    /**
     * Array of messages for error description
     * 
     * @type {string[]}
     * @memberOf IErrorProps
     */
    messages: string[];
    /**
     * Buttons container for user reactions on an error
     * 
     * @type {JSX.Element}
     * @memberOf IErrorProps
     */
    buttons: JSX.Element;
}

/**
 * Error component
 *
 * @export
 * @param {IErrorProps} props
 * @returns {JSX.Element}
 */
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