import { PublicationContent } from "./PublicationContent";
import { IServices } from "../../interfaces/Services";
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
     * Services
     *
     * @type {IServices}
     * @memberOf IAppProps
     */
    services: IServices;
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
        const { selectedPublicationId } = this.state;
        const { services, routing } = this.props;
        const { formatMessage } = services.localizationService;
        return (
            <div className={"sdl-dita-delivery-app"}>
                <TopBar title={formatMessage("components.app.title")} buttons={{
                    user: {
                        isPicture: true
                    }
                }} />
                <PublicationContent publicationId={selectedPublicationId} services={services} routing={routing} />
            </div>
        );
    }
};
