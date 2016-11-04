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

export interface IAppWrapperChildContext {
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
export class AppWrapper extends React.Component<IAppWrapperProps, {}> {

    public static childContextTypes: React.ValidationMap<IAppWrapperChildContext> = {
        service: React.PropTypes.object,
        localization: React.PropTypes.object
    };

    public getChildContext(): IAppWrapperChildContext {
        const { services, routing} = this.props;
        return {
            services: services,
            routing: routing
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
                    <Route path=":publicationId(/:publicationTitle)" component={PublicationContent} />} />
                    <Route path=":publicationId/:publicationTitle/:pageTitle" component={PublicationContent} />} />
                    <Route path=":publicationId/:pageId/:publicationTitle/:pageTitle" component={PublicationContent} />} />
                </Route>
            </Router>
        );
    }
};
