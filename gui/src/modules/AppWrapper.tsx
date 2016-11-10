/// <reference path="../../typings/index.d.ts" />

import { Router, Route, IndexRedirect } from "react-router";

import { IServices } from "../interfaces/Services";
import { IRouting } from "../interfaces/Routing";

import { App } from "../components/container/App";
import { PublicationContent } from "../components/container/PublicationContent";

export interface IAppWrapperProps {
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
export class AppWrapper extends React.Component<IAppWrapperProps, {}> {

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
                <Route path="/" component={App} >
                    <IndexRedirect to="/ish:1656863-1-1" />
                    <Route path=":publicationId" component={PublicationContent}>
                        <Route path=":pageId(/:pageTitle)" component={PublicationContent} />
                    </Route>
                </Route >
            </Router >
        );
    }
};
