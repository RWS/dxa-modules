import { ILocalization } from "../../interfaces/Localization";
import "./styles/App";
import "../controls/styles/TopBar";

// Global Catalina dependencies
import TopBar = SDL.ReactComponents.TopBar;

export interface IAppProps {
    /**
     * Localization
     *
     * @type {ILocalization}
     * @memberOf IAppProps
     */
    localization: ILocalization;
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
    localization: ILocalization;
}

/**
 * Main component for the application
 */
export class App extends React.Component<IAppProps, {}, > {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        localization: React.PropTypes.object.isRequired
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { formatMessage } = (this.context as IAppContext).localization;
        return (
            <div className={"sdl-dita-delivery-app"}>
                <TopBar title={formatMessage("components.app.title")} buttons={{
                    user: {
                        isPicture: true
                    }
                }} />

                {this.props.children}
            </div>
        );
    }
};
