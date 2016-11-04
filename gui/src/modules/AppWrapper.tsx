/// <reference path="../../typings/index.d.ts" />

import { Router, Route, IndexRedirect } from "react-router";

import { IDataStore } from "../interfaces/DataStore";
import { ILocalization } from "../interfaces/Localization";
import { IRouting } from "../interfaces/Routing";

import { App } from "../components/container/App";
import { PublicationContent } from "../components/container/PublicationContent";

export interface IAppWrapperProps {
    /**
     * Data store
     *
     * @type {IDataStore}
     * @memberOf IAppWrapperProps
     */
    dataStore: IDataStore;

    /**
     * Localization
     *
     * @type {ILocalization}
     * @memberOf IAppProps
     */
    localization: ILocalization;

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
     * Data store
     *
     * @type {IDataStore}
     * @memberOf IAppWrapperProps
     */
    dataStore: IDataStore;

    /**
     * Localization
     *
     * @type {ILocalization}
     * @memberOf IAppProps
     */
    localization: ILocalization;

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
        dataStore: React.PropTypes.object,
        routing: React.PropTypes.object,
        localization: React.PropTypes.object
    };

    public getChildContext(): IAppWrapperChildContext {
        const { dataStore, localization, routing} = this.props;
        return {
            dataStore: dataStore,
            routing: routing,
            localization: localization
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
