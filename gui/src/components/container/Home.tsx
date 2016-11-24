import { IAppContext } from "./App";
import "./styles/App";
import "../controls/styles/TopBar";

// Global Catalina dependencies
import TopBar = SDL.ReactComponents.TopBar;

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
                <div className={"sdl-dita-delivery-content-wrapper"}>
                    <TopBar className={".sdl-dita-delivery-content-wrapper"} title={localizationService.formatMessage("components.app.title")} buttons={{
                        user: {
                            isPicture: true
                        }
                    }} />
                </div>

                {this.props.children}
            </div>
        );
    }
};
