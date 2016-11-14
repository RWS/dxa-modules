import { Router, Route, IndexRedirect } from "react-router";

import { IServices } from "../../interfaces/Services";
import { IRouting } from "../../interfaces/Routing";

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
     * Routing
     *
     * @type {IRouting}
     * @memberOf IAppProps
     */
    routing: IRouting;
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
        const { routing } = this.props;
        return (
            <Router history={routing.getHistory()}>
                <Route path="/" component={Home} >
                    <IndexRedirect to="/ish:1656863-1-1" />
                    <Route path=":publicationId" component={PublicationContent}>
                        <Route path=":pageId(/:pageTitle)" component={PublicationContent} />
                    </Route>
                </Route >
            </Router >
        );
    }
};
