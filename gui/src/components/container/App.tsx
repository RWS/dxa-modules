import { IAppContext } from "../../modules/AppWrapper";
import "./styles/App";
import "../controls/styles/TopBar";

// Global Catalina dependencies
import TopBar = SDL.ReactComponents.TopBar;

/**
 * Main component for the application
 */
export class App extends React.Component<{}, {}> {

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
                <TopBar title={localizationService.formatMessage("components.app.title")} buttons={{
                    user: {
                        isPicture: true
                    }
                }} />

                {this.props.children}
            </div>
        );
    }
};
