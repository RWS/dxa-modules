import { Router, Route, IndexRedirect, History } from "react-router";
import { IServices } from "../../interfaces/Services";
import { Home } from "./Home";
import { PublicationContent } from "./PublicationContent";

export interface IAppProps {
    /**
     * Services
     *
     * @type {IServices}
     * @memberOf IAppProps
     */
    services: IServices;
    /**
     * History
     *
     * @type {History}
     * @memberOf IAppProps
     */
    history: History;
}

export interface IAppContext {
    /**
     * Router
     *
     * @type {ReactRouter.RouterOnContext}
     * @memberOf IAppContext
     */
    router?: ReactRouter.RouterOnContext;
    /**
     * Services
     *
     * @type {IServices}
     * @memberOf IAppContext
     */
    services: IServices;
}

/**
 * Main component for the application
 */
export class App extends React.Component<IAppProps, {}> {

    public static childContextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object
    };

    public getChildContext(): IAppContext {
        const { services} = this.props;
        return {
            services: services
        };
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { history } = this.props;
        return (
            <Router history={history}>
                <Route path="/" component={Home} >
                    <IndexRedirect to="/ish:1656863-1-1" />
                    <Route path=":publicationId(/:pageIdOrPublicationTitle)(/:publicationTitle)(/:pageTitle)" component={PublicationContent} />
                </Route >
            </Router >
        );
    }
};
