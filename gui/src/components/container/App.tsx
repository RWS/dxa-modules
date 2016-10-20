import { PublicationContent } from "./PublicationContent";
import { ILocalization } from "../../interfaces/Localization";
import { IDataStore } from "../../interfaces/DataStore";
import { IRouting } from "../../interfaces/Routing";
import "./styles/App";
import "../controls/styles/TopBar";

// Global Catalina dependencies
import TopBar = SDL.ReactComponents.TopBar;

/**
 * App component state
 *
 * @export
 * @interface IAppState
 */
export interface IAppState {
    /**
     * Id of the open publication
     *
     * @type {string}
     */
    selectedPublicationId: string;
}

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
    dataStore: IDataStore;
    /**
     * Routing
     *
     * @type {IRouting}
     * @memberOf IAppProps
     */
    routing: IRouting;
}

/**
 * Main component for the application
 */
export class App extends React.Component<IAppProps, IAppState> {

    /**
     * Creates an instance of App.
     *
     */
    constructor() {
        super();
        this.state = {
            selectedPublicationId: "ish:1656863-1-1"
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { formatMessage } = this.props.localization;
        const { selectedPublicationId } = this.state;
        const { dataStore, routing } = this.props;
        return (
            <div className={"sdl-dita-delivery-app"}>
                <TopBar title={formatMessage("components.app.title")} buttons={{
                    user: {
                        isPicture: true
                    }
                }} />
                <PublicationContent publicationId={selectedPublicationId} dataStore={dataStore} routing={routing} />
            </div>
        );
    }
};
