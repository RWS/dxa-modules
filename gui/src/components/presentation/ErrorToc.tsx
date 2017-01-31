import * as React from "react";
import "components/presentation/styles/ErrorToc";
import { Button } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";
import { IAppContext } from "components/container/App";

/**
 * ErrorToc component props
 *
 * @export
 * @interface IErrorTocProps
 */
export interface IErrorTocProps {
    /**
     * Message for error description
     *
     * @type {string}
     * @memberOf IErrorTocProps
     */
    message: string;

    /**
     * Handler for getting Toc
     *
     * @type {string}
     * @memberOf IErrorTocProps
     */
    onRetry: () => void;
}

/**
 * Error Toc component
 *
 * @export
 * @param {IErrorTocProps} props
 * @returns {JSX.Element}
 */
export const ErrorToc: React.StatelessComponent<IErrorTocProps> = (props: IErrorTocProps, context: IAppContext): JSX.Element => {
    const { message, onRetry } = props;
    const { formatMessage } = context.services.localizationService;

    return (
        <div className="sdl-dita-delivery-error-toc">
            <div className="sdl-dita-delivery-error-toc-content">
                <div className="sdl-dita-delivery-error-toc-message">{message}</div>
                <Button purpose={ButtonPurpose.CONFIRM} events={{"click": onRetry}}>{formatMessage("control.button.retry")}</Button>
            </div>
        </div>
    );
};

ErrorToc.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
