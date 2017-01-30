import * as React from "react";
import "components/presentation/styles/ErrorComponent";
import "dist/dita-ot/styles/commonltr";
import "dist/dita-ot/styles/commonrtl";

export interface IErrorComponentProps {
    errorTitle: string;
    errorMessages: string[];
    errorButtons: JSX.Element;
}

export class ErrorComponent extends React.Component<IErrorComponentProps, {}> {

    constructor(options: IErrorComponentProps) {
        super();
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     *
     * @memberOf Page
     */
    public render(): JSX.Element {
        const props = this.props;
        const messages = props.errorMessages.map((value, index) => <p key={index}>{value}</p>);

        return (
            <div className={"error-page-component"}>
                <h1>{props.errorTitle}</h1>
                <div>{messages}</div>
                <div className="sdl-button-group">
                    {props.errorButtons}
                </div>
            </div>
        );
    }
}
