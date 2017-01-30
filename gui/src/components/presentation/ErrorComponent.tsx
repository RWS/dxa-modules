import * as React from "react";
import "components/presentation/styles/ErrorComponent";
import "dist/dita-ot/styles/commonltr";
import "dist/dita-ot/styles/commonrtl";

import { IAppContext } from "components/container/App";

export interface IErrorComponentProps {
    errorTitle: string;
    errorMessage: string[];
    errorButtons: JSX.Element;
}

export interface IPageProps {
    content?: string | null;
}

export class ErrorComponent extends React.Component<IErrorComponentProps, {}> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

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
        const { formatMessage } = this.context.services.localizationService;
        const message = props.errorMessage.map((value, index) => <p key={index}>{formatMessage(value)}</p>);

        return (
            <div className={"error-page-component"}>
                <h1>{formatMessage(props.errorTitle)}</h1>
                <div>{message}</div>
                <div className="sdl-button-group">
                    {props.errorButtons}
                </div>
            </div>
        );
    }
}
