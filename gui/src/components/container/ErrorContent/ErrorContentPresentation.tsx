import * as ClassNames from "classnames";
import * as React from "react";
import { path } from "utils/Path";
import { SearchBar } from "@sdl/dd/presentation/SearchBar";
import { Error } from "@sdl/dd/presentation/Error";
import { IAppContext } from "@sdl/dd/container/App/App";
import { Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";

import { IError } from "interfaces/Error";

import "./ErrorContent.less";
import "components/controls/styles/Button";

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

    /**
     * Content direction
     *
     * @type {("ltr" | "rtl")}
     * @memberOf IErrorContentProps
     */
    direction?: "ltr" | "rtl";
}

/**
 * Error content component
 *
 * @export
 * @param {IErrorContentProps} props
 * @returns {JSX.Element}
 */
export const ErrorContentPresentation: React.StatelessComponent<IErrorContentProps> = (props: IErrorContentProps, context: IAppContext): JSX.Element => {
    const { formatMessage } = context.services.localizationService;
    const _goHome = (): void => window.location.replace(path.getRootPath());

    const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{"click": _goHome}}>{formatMessage("components.breadcrumbs.home")}</Button>
        </div>;

    const { error, direction } = props;
    const errorMessages = [formatMessage("error.url.not.found"), formatMessage("error.default.message")];
    const errorTitle = error && error.statusCode ?
        `${error.statusCode} - ${formatMessage("error.default.title")}` :
        formatMessage("error.default.title");

    const appClass = ClassNames(direction, "sdl-dita-delivery-error-content");

    return (
        <section className={appClass}>
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

ErrorContentPresentation.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
