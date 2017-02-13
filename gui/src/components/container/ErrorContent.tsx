import * as React from "react";
import { path } from "utils/Path";
import { SearchBar } from "components/presentation/SearchBar";
import { Error } from "components/presentation/Error";
import { IAppContext } from "components/container/App";
import { Button } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";

import { IError } from "interfaces/Error";

import "components/container/styles/ErrorContent";

/**
 * Error content component props
 *
 * @export
 * @interface IErrorContentProps
 */
export interface IErrorContentProps {
    /**
     * Error object information to render on the page
     * 
     * @type {IError}
     */
    error?: IError;
}

/**
 * Error content component
 *
 * @export
 * @param {IErrorContentProps} props
 * @returns {JSX.Element}
 */
export const ErrorContent: React.StatelessComponent<IErrorContentProps> = (props: IErrorContentProps, context: IAppContext): JSX.Element => {
    const { formatMessage } = context.services.localizationService;
    const _goHome = (): void => window.location.replace(path.getRootPath());

    const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{"click": _goHome}}>{formatMessage("components.breadcrumbs.home")}</Button>
        </div>;

    const error = props.error;
    const errorMessages = error && error.message ? [error.message, formatMessage("error.default.message")] : [formatMessage("error.default.message")];
    const errorTitle = error && error.statusCode ?
        `${error.statusCode} - ${formatMessage("error.default.title")}` :
        formatMessage("error.default.title");

    return (
        <section className={"sdl-dita-delivery-error-content"}>
            <SearchBar
                placeholderLabel={formatMessage("components.searchbar.placeholder")}
                onSearch={query => console.log(query)} />
            <div className={"sdl-dita-delivery-error-page"}>
                <Error
                    title={errorTitle}
                    messages={errorMessages}
                    buttons={errorButtons} />
            </div>
        </section>
    );
};

ErrorContent.contextTypes = {
    services: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
