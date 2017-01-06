import * as React from "react";
import { IAppContext } from "components/container/App";
import { TopBar } from "components/presentation/TopBar";

import "components/container/styles/App";

/**
 * Main component for the application
 */
export class Home extends React.Component<{}, {}> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = this.context.services;
        return (
            <div className={"sdl-dita-delivery-app"}>
                <TopBar
                    title={localizationService.formatMessage("app.productfamily")}
                    language={localizationService.formatMessage("app.language")}
                    />
                {this.props.children}
            </div>
        );
    }
};
