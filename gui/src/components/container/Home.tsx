import { IAppContext } from "./App";
import { TopBar } from "../presentation/TopBar";

import "./styles/App";

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
                    selectedProductFamilyTitle={localizationService.formatMessage("app.productfamily")}
                    selectedLanguage={localizationService.formatMessage("app.language")}
                />
                {this.props.children}
            </div>
        );
    }
};
