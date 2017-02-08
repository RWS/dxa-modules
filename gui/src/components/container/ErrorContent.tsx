import * as React from "react";
import { SearchBar } from "components/presentation/SearchBar";
import { Error } from "components/presentation/Error";
import { IAppContext } from "components/container/App";
import { Button } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";

import "components/container/styles/ErrorContent";

/**
 * Error content component props
 *
 * @export
 * @interface IErrorContentProps
 */
export interface IErrorContentProps {

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
    const _goHome = (): void => context.router && context.router.push("/");

    const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{"click": _goHome}}>{formatMessage("components.breadcrumbs.home")}</Button>
        </div>;

    return (
        <section className={"sdl-dita-delivery-error-content"}>
            <SearchBar
                placeholderLabel={formatMessage("components.searchbar.placeholder")}
                onSearch={query => console.log(query)} />
            <div className={"sdl-dita-delivery-error-page"}>
                <Error
                    title={formatMessage("error.page.not.found.title")}
                    messages={[formatMessage("error.page.not.found"), formatMessage("error.default.message")]}
                    buttons={errorButtons} />
            </div>
        </section>
    );
};

ErrorContent.contextTypes = {
    services: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
