import { IServices } from "../../interfaces/Services";
import "./styles/App";
import "../controls/styles/TopBar";

// Global Catalina dependencies
import TopBar = SDL.ReactComponents.TopBar;

export interface IAppProps {
    /**
     * Data store
     *
     * @type {IDataStore}
     * @memberOf IAppProps
     */
    children: React.ReactChild;
}

export interface IAppContext {
    /**
     * Localization
     *
     * @type {ILocalization}
     * @memberOf IAppProps
     */
    services: IServices;
}

/**
 * Main component for the application
 */
export class App extends React.Component<IAppProps, {},> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = (this.context as IAppContext).services;
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
